const express = require("express");
const { authenticateJwt } = require("../middleware/auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET = process.env.SECRET;
const { User, Event } = require("../db/index");
const multer = require("multer");
const path = require("path");
const cloudinary = require("../helper/cloudinaryConfig");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("hello");
});

router.get("/events", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
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

module.exports = router;
