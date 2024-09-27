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
const eventSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

// message schema
const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// chat schema
const chatSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
});

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Title of the notification
  // Reference to the User receiving the notification
  recipient: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  // Reference to the event related to the notification
  event: { type: mongoose.Types.ObjectId, ref: "Event", required: true },
  isRead: { type: Boolean, default: false }, // Status to check if the notification is read
  createdAt: { type: Date, default: Date.now }, // Notification creation time
});

const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Event = mongoose.model("Event", eventSchema);
const Message = mongoose.model("Message", messageSchema);
const Chat = mongoose.model("Chat", chatSchema);
const Notification = mongoose.model("Notification", notificationSchema);

module.exports = {
  User,
  Admin,
  Event,
  Message,
  Chat,
  Notification,
};
