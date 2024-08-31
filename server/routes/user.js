const express = require("express");
const { authenticateJwt } = require("../middleware/auth");
require("dotenv").config();
const SECRET = process.env.SECRET;
const { User, Event } = require("../db/index");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  res.json();
});

// Sign up user
router.post("/signup", async (req, res) => {
  const { username, password, role } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    res.status(403).json({ message: "User already exists" });
  } else {
    const newUser = new User({ username, password, role });
    await newUser.save();
    const token = jwt.sign({ username, role }, SECRET, { expiresIn: "1h" });
    res.json({ message: "User created successfully", token });
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    const token = jwt.sign({ _id: user._id }, SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "Invalid username or password" });
  }
});

// Create an event
router.post("/create_event", async (req, res) => {
  try {
    const { title, createdBy } = req.body;

    // Verify that the user is an organizer
    const organizer = await User.findById(createdBy);
    if (!organizer || organizer.role !== "organizer") {
      return res
        .status(403)
        .json({ error: "Only organizers can create events" });
    }

    // Create the event
    const event = new Event({ title, createdBy });
    await event.save();

    // Add the event to the organizer's events array
    organizer.events.push(event._id);
    await organizer.save();

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: "Error creating event" });
  }
});

// Find my events
router.get("/my_events", authenticateJwt, async (req, res) => {
  try {
    const userId = req.user._id;

    // Find events created by the logged-in user
    const events = await Event.find({ createdBy: userId }).populate(
      "createdBy",
      "username"
    );

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Error fetching events" });
  }
});

// Find all created events
router.get("/events", async (req, res) => {
  try {
    const events = await Event.find({})
      .populate("createdBy", "username")
      .populate("attendees", "username");
    console.log(events);

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Error fetching events" });
  }
});

// Find an events
router.get("/events/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the event by ID and populate if needed
    const event = await Event.findById(id)
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
router.put("/update_event/:eventId", authenticateJwt, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { title } = req.body;
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

    // Update the event details
    event.title = title || event.title;
    await event.save();

    res.status(200).json({ message: "Event updated successfully", event });
  } catch (error) {
    res.status(500).json({ error: "Error updating event" });
  }
});

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

// Add attendees to event
router.post("/events/:eventId/attendees", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId } = req.body; // Assuming you pass the user's ID in the request body

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

// Search events
router.get("/search_events", async (req, res) => {
  try {
    const { query } = req.query; // The search query parameter

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Perform a search based on the query
    const events = await Event.find({
      title: { $regex: query, $options: "i" }, // Case-insensitive search
    }).populate("createdBy", "username");

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Error searching events" });
  }
});

// Search users
router.get("/search_users", async (req, res) => {
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

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}).populate();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

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

module.exports = router;
