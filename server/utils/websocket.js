const WebSocket = require("ws");
const { User, Event, Chat, Message } = require("../db/index");
const wsAuth = require("../middleware/wsAuth");

function createWebSocketServer(httpServer) {
  const wss = new WebSocket.Server({ noServer: true });

  httpServer.on("upgrade", (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wsAuth(ws, req, (err) => {
        if (err) {
          ws.close(); // Close connection if authentication fails
          return;
        }
        wss.emit("connection", ws, req);
      });
    });
  });

  wss.on("connection", (ws, req) => {
    // Assuming `wsAuth` attaches user to ws
    const { _id: userId, username } = ws.user;

    // Set userId and username to the WebSocket connection for later use
    ws.userId = userId;
    ws.username = username;

    // Handle incoming messages
    ws.on("message", async (message) => {
      try {
        const { eventId, text } = JSON.parse(message);

        // Set the eventId on the ws object for future messages
        ws.eventId = eventId;

        // Check if the user is part of the event
        const event = await Event.findById(eventId).populate("attendees").exec();

        if (!event || (event.createdBy.toString() !== userId.toString() && !event.attendees.some(attendee => attendee._id.toString() === userId.toString()))) {
          ws.send("You are not authorized to chat in this event.");
          return;
        }

        // Ensure chat record exists
        let chat = await Chat.findOne({ event: eventId });
        if (!chat) {
          chat = new Chat({ event: eventId, messages: [] });
          await chat.save();
        }

        // Create and save message
        const messageDoc = new Message({
          sender: userId,
          content: text,
        });

        await messageDoc.save();

        // Add message to chat
        await Chat.updateOne(
          { event: eventId },
          { $push: { messages: messageDoc._id } }
        );

        // Find the sender username
        const user = await User.findById(userId);
        const senderUsername = user.username;

        // Broadcast the message to all clients connected to the same event
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN && client.userId && client.eventId === eventId) {
            // Send the message to the connected clients
            client.send(
              JSON.stringify({
                sender: {
                  username: senderUsername
                },
                content: text,
              })
            );
          }
        });
      } catch (error) {
        console.error("Error processing message:", error);
      }
    });

    ws.on("close", () => console.log("Client disconnected"));
    ws.on("error", (error) => console.error("WebSocket error:", error));
  });

  return wss;
}

module.exports = createWebSocketServer;
