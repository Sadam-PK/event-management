const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const createWebSocketServer = require("./utils/websocket");

const app = express();
const server = http.createServer(app);

// Initialize WebSocket server
createWebSocketServer(server);

const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
const organizerRouter = require("./routes/organizer");
const attendeeRouter = require("./routes/attendee");

app.use(cors());
app.use(express.json());

app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/organizer", organizerRouter);
app.use("/attendee", attendeeRouter);

// db connection
mongoose.connect("mongodb://localhost:27017", {
  dbName: "event-management",
});

server.listen(3000, () => console.log("Server running on port 3000"));
