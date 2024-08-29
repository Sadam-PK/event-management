const express = require("express");
const { authenticateJwt } = require("../middleware/auth");
require("dotenv").config();
const SECRET = process.env.SECRET;
const { User, Event, Admin } = require("../db/index");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  res.json();
});

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

router.get("/my_events", authenticateJwt, async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you have middleware that adds the authenticated user's ID to req.user
    // console.log(userId);

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

module.exports = router;
