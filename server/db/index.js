const mongoose = require("mongoose");
// Define mongoose schemas

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["organizer", "attendee"], required: true }, // Role: Organizer or Attendee
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }], // Events they created or joined
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Reference to the Organizer
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // References to Attendees
});

const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Event = mongoose.model("Event", eventSchema);

module.exports = {
  User,
  Admin,
  Event,
};
