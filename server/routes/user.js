const express = require("express");
const { authenticateJwt } = require("../middleware/auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET = process.env.SECRET;
const { User, Chat } = require("../db/index");
const router = express.Router();

(async () => {
  const { loginSchema, signUpSchema, eventSchema } = await import(
    "../../common/zodSchema.js"
  );

  // Sign up user -- common route for attendees and organizers
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

  // Login user -- common route for attendees and organizers
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

  // Get User Profile ------ used by both users // attendee//organizer
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

  // Fetch messages for a particular event
  router.get("/events/:eventId/messages", async (req, res) => {
    try {
      const { eventId } = req.params;
      const chat = await Chat.findOne({ event: eventId }).populate("messages");
      if (!chat) {
        return res.status(404).json({ error: "No chat found for this event" });
      }

      res.json(chat.messages);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });
})();

module.exports = router;
