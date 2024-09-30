const express = require("express");
const { authenticateJwt } = require("../middleware/auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User, Event, Notification } = require("../db/index");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const cloudinary = require("../helper/cloudinaryConfig");
const zod = require("zod");
const fs = require("fs");

const { eventSchema } = require("@sadamccr/eventcommon");

const imgConfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads");
  },
  filename: (req, file, callback) => {
    callback(null, `image-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// image filter
const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new Error("Only images are allowed"));
  }
};

// multer
const upload = multer({
  storage: imgConfig,
  fileFilter: isImage,
});

// Create an event

router.post(
  "/create_event",
  authenticateJwt,
  upload.single("photo"),
  async (req, res) => {
    try {
      // Convert maxAttendees to a number
      req.body.maxAttendees = Number(req.body.maxAttendees);

      // Validate request body using Zod schema
      const parsedData = eventSchema.parse(req.body);

      // Cloudinary upload
      const upload = await cloudinary.uploader.upload(req.file.path);

      // Remove the file from the local uploads folder
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        }
      });
      const { title, description, location, date, time, maxAttendees } =
        parsedData;

      // The user's ID is available from req.user, assuming your authenticateJwt middleware populates it
      const userId = req.user._id;

      // Verify that the user is an organizer
      const organizer = await User.findById(userId);
      if (organizer.role !== "organizer") {
        return res
          .status(403)
          .json({ error: "Only organizers can create events" });
      }

      // Create the event
      const event = new Event({
        title,
        description,
        imgPath: upload.secure_url, // Set the imgPath field
        createdBy: userId,
        date,
        time,
        location,
        maxAttendees,
      });

      await event.save();

      // Add the event to the organizer's events array
      organizer.events.push(event._id);
      await organizer.save();

      res.status(201).json(event);
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof zod.ZodError) {
        console.error("Validation error:", error.errors);
        return res.status(400).json({ error: error.errors });
      }

      console.error("Error creating event:", error);
      res.status(500).json({ error: "Error creating event" });
    }
  }
);

// Find my events
router.get("/my_events", authenticateJwt, async (req, res) => {
  try {
    const userId = req.user._id;

    // Pagination parameters from query string
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 6; // Default to 6 events per page

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Find events created by the logged-in user with pagination
    const events = await Event.find({ createdBy: userId })
      .populate("createdBy", "username")
      .populate("attendees", "username")
      .skip(skip)
      .limit(limit);

    // Get total count of events (to calculate total pages)
    const totalEvents = await Event.countDocuments({ createdBy: userId });

    res.status(200).json({
      events,
      currentPage: page,
      totalPages: Math.ceil(totalEvents / limit),
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching events" });
  }
});

router.get("/events/:id", authenticateJwt, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the event by ID and populate if needed
    const event = await Event.findById(id)
      // const page = = pa
      .populate("createdBy", "username")
      .populate("attendees", "username");

    if (!event) {
      // If the event is not found, return a 404 status
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: "Error fetching event" });
  }
});

// Update an event
router.put(
  "/update_event/:eventId",
  authenticateJwt,
  upload.single("photo"),
  async (req, res) => {
    try {
      const { eventId } = req.params;
      const { title, date, time, location, description, maxAttendees } =
        req.body;
      const userId = req.user._id;

      // Find the event and ensure the user is the organizer
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      if (event.createdBy.toString() !== userId.toString()) {
        return res
          .status(403)
          .json({ error: "Only the organizer can update this event" });
      }

      // Update event fields
      event.title = title || event.title;
      event.time = time;
      event.date = date;
      event.location = location;
      event.description = description;
      event.maxAttendees = maxAttendees;

      // Upload new photo to Cloudinary if provided
      if (req.file) {
        const upload = await cloudinary.uploader.upload(req.file.path);
        event.imgPath = upload.secure_url;

        // Delete the local file after upload
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          }
        });
      }

      // Save the updated event
      await event.save();

      // Notify each attendee
      const attendees = event.attendees;
      for (const attendeeId of attendees) {
        try {
          const notification = new Notification({
            title: "Event has been updated",
            event: event._id,
            recipient: attendeeId,
          });
          await notification.save();
        } catch (error) {
          console.error(
            `Error saving notification for attendee ${attendeeId}:`,
            error
          );
        }
      }

      res.status(200).json({ message: "Event updated successfully", event });
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ error: "Error updating event" });
    }
  }
);

// Delete an event
router.delete("/delete_event/:eventId", authenticateJwt, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    // Find the event and ensure the user is the organizer
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    if (event.createdBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "Only the organizer can delete this event" });
    }

    // Delete the event
    await Event.findByIdAndDelete(eventId);

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ error: "Error deleting event" });
  }
});

// Notification of event ...

module.exports = router;
