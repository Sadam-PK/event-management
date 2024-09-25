const express = require("express");
const { authenticateJwt } = require("../middleware/auth");
require("dotenv").config();
const { User, Event, Notification } = require("../db/index");
const router = express.Router();

// fetch organizers created events
router.get("/events", authenticateJwt, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;
    const keyword = req.query.q || ""; // Optional search keyword
    const sortBy = req.query.sortBy || "createdAt"; // Default sorting field
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1; // Default to ascending order

    const query = keyword ? { title: { $regex: keyword, $options: "i" } } : {};

    const events = await Event.find(query)
      .populate("createdBy", "username")
      .populate("attendees", "username")
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder }); // Apply sorting

    const totalEvents = await Event.countDocuments(query);

    res.status(200).json({
      events,
      currentPage: page,
      totalPages: Math.ceil(totalEvents / limit),
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching events" });
  }
});

// Find a single event
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

// Join an event
router.post("/events/:eventId/attendees", authenticateJwt, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    // Find the event by ID
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the max number of attendees has been reached
    if (event.attendees.length >= event.maxAttendees) {
      return res
        .status(401)
        .json({ message: "Maximum number of attendees reached" });
    }

    // Check if the user is already an attendee
    if (event.attendees.includes(userId)) {
      return res.status(400).json({ message: "User is already an attendee" });
    }
    // Add the user to the event's attendees list
    event.attendees.push(userId);
    await event.save();

    // Add the event to the user's events list
    user.events.push(eventId);
    await user.save();

    res.status(200).json({ message: "Attendee added successfully", event });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
});

// Get Notification
router.get("/notification", authenticateJwt, async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch event IDs where the user is an attendee
    const eventIds = await Event.find({ attendees: userId }).select("_id");

    // Fetch notifications for those events and filter by recipient
    const notifications = await Notification.find({
      event: { $in: eventIds },
      // Filter by the recipient to ensure notifications belong to the logged-in user
      recipient: userId,
    })
      .populate("event", "_id title")
      .exec();

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.patch("/notifications/:id", async (req, res) => {
  const notificationId = req.params.id;
  const { isRead } = req.body; // Extract the 'isRead' field from the request body

  try {
    // Find the notification by ID and update only the 'isRead' field
    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: isRead }, // Update the 'isRead' field
      { new: true } // Return the updated document
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(updatedNotification);
  } catch (error) {
    res.status(500).json({ message: "Error updating notification", error });
  }
});

module.exports = router;
