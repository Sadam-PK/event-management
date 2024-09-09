const mongoose = require("mongoose");
// Define mongoose schemas

// user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["organizer", "attendee"], required: true }, // Role: Organizer or Attendee
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }], // Events they created or joined
});

// admin schema

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

// event schema
const eventSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  imgPath: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  maxAttendees: { type: Number, required: true },
  // Reference to the Organizer
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // References to Attendees
});

// message schema
const messageSchema = new mongoose.Schema({
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  attendee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: { type: String, required: true },
});

// chat schema
const chatSchema = new mongoose.Schema({
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
});

const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Event = mongoose.model("Event", eventSchema);
const Message = mongoose.model("Message", messageSchema);
const Chat = mongoose.model("Chat", chatSchema);

module.exports = {
  User,
  Admin,
  Event,
  Message,
  Chat,
};
