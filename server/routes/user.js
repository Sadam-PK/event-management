const express = require("express");
const { authenticateJwt } = require("../middleware/auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET = process.env.SECRET;
const { User, Event } = require("../db/index");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const cloudinary = require("../helper/cloudinaryConfig");
const zod = require("zod");
const fs = require("fs");

(async () => {
  const { loginSchema, signUpSchema, eventSchema } = await import(
    "../../common/zodSchema.js"
  );

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

  // Sign up user
  router.post("/signup", async (req, res) => {
    try {
      const { username, password, role } = req.body;
      const response = signUpSchema.safeParse({ username, password, role });

      if (response.success) {
        const user = await User.findOne({ username: response.username });
        if (user) {
          res.status(403).json({ message: "User already exists" });
        } else {
          const newUser = new User({ username, password, role });
          await newUser.save();
          const token = jwt.sign({ username, role }, SECRET, {
            expiresIn: "1h",
          });
          res.json({ message: "User created successfully", token });
        }
      }
    } catch (error) {
      if (error.code === 11000) {
        // MongoDB duplicate key error code
        res.status(400).json({ message: "Username already exists." });
      } else {
        console.error("Error during user creation:", error); // Log the error for debugging
        res
          .status(500)
          .json({ message: "An error occurred while creating the user." });
      }
    }
  });

  // Login user
  router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const response = loginSchema.safeParse({ username, password });

    if (response.success) {
      const user = await User.findOne({ username: response.data.username });

      if (user && user.password === password) {
        // Assuming password is stored as plain text
        const token = jwt.sign({ _id: user._id }, SECRET, {
          expiresIn: "1h",
        });
        res.json({ message: "Logged in successfully", token });
      } else {
        res.status(403).json({ message: "Invalid username or password" });
      }
    } else {
      res.status(400).json({ error: response.error.errors });
    }
  });

  // Current User
  router.get("/me", authenticateJwt, async (req, res) => {
    try {
      const userId = req.user._id;
      // console.log(userId);

      // Find the logged-in user by their ID
      const user = await User.findById({ _id: userId }).select("username role");

      // If no user is found, return a 404 response
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Return the found user
      res.status(200).json(user);
    } catch (error) {
      // Log the error to get more details
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Error fetching user" });
    }
  });

  // Search users
  router.get("/search_users", authenticateJwt, async (req, res) => {
    try {
      const { query } = req.query; // The search query parameter

      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }

      // Perform a search based on the query
      const users = await User.find({
        username: { $regex: query, $options: "i" }, // Case-insensitive search
      });

      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: "Error searching users" });
    }
  });

  // get all users
  router.get("/users", async (req, res) => {
    try {
      const users = await User.find({}).populate();
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ error: "Error fetching users" });
    }
  });

  // ###################### Create an event ###################################
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

  // Find all created events with optional search
  router.get("/events", authenticateJwt, async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 6;
      const skip = (page - 1) * limit;
      const keyword = req.query.q || ""; // Optional search keyword
      const sortBy = req.query.sortBy || "createdAt"; // Default sorting field
      const sortOrder = req.query.sortOrder === "desc" ? -1 : 1; // Default to ascending order

      const query = keyword
        ? { title: { $regex: keyword, $options: "i" } }
        : {};

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

  // Find an events

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

        // Update the event title if provided
        event.title = title || event.title;
        event.time = time;
        event.date = date;
        event.location = location;
        event.description = description;
        event.maxAttendees = maxAttendees;

        // Check if a new photo is uploaded
        if (req.file) {
          // Upload the new photo to Cloudinary
          const upload = await cloudinary.uploader.upload(req.file.path);

          // Update the imgPath with the new Cloudinary URL
          event.imgPath = upload.secure_url;
        }
        // Remove the file from the local uploads folder
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          }
        });

        // Save the updated event
        await event.save();

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

  // Join ---- Add attendees to event
  router.post(
    "/events/:eventId/attendees",
    authenticateJwt,
    async (req, res) => {
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
          return res
            .status(400)
            .json({ message: "User is already an attendee" });
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
    }
  );

  // ---------- user profile related queries

  // Update User Profile
  router.put("/profile", authenticateJwt, async (req, res) => {
    const userId = req.user._id;
    const { username, password } = req.body;

    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      user.username = username || user.username;
      user.password = password || user.password; // Make sure to hash the password before saving
      await user.save();

      res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
      res.status(500).json({ error: "Error updating profile" });
    }
  });

  // Get User Profile
  router.get("/profile", authenticateJwt, async (req, res) => {
    const userId = req.user._id;

    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Error fetching profile" });
    }
  });

  // Delete User Account
  router.delete("/profile", authenticateJwt, async (req, res) => {
    const userId = req.user._id;

    try {
      await User.findByIdAndDelete(userId);
      res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting account" });
    }
  });
})();

module.exports = router;
