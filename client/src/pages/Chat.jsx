import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Chat = ({ eventId }) => {
  const [ws, setWs] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token"); // token from localStorage or state
    console.log(`token -----> ${token}`);

    // web socket connection via token
    const socket = new WebSocket(`ws://localhost:3000?token=${token}`);

    // On WebSocket connection open
    socket.onopen = () => {
      console.log("Connected to WebSocket");
    };

    // Handle incoming messages
    socket.onmessage = (event) => {
      const incomingMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, incomingMessage]);
    };

    // Handle WebSocket errors
    socket.onerror = (error) => {
      console.error("WebSocket error", error);
    };

    // Handle WebSocket close event
    socket.onclose = (event) => {
      console.log("WebSocket closed", event.reason);
    };

    // Save the WebSocket connection to state
    setWs(socket);

    // Clean up the WebSocket connection when the component is unmounted
    return () => {
      socket.close();
    };
  }, []);

  // Function to send a message
  const sendMessage = () => {
    if (ws && message) {
      const messagePayload = {
        eventId: eventId, // event id passed via props // consider updating
        text: message,
      };

      ws.send(JSON.stringify(messagePayload));
      setMessage(""); // Clear the input after sending message
    }
  };

  return (
    <div>
      <h2>Chat</h2>

      {/* Display incoming messages */}
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender}:</strong> {msg.message}
          </p>
        ))}
      </div>

      {/* Input to send a message */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message"
        className="border outline-none p-1"
      />
      <button
        onClick={sendMessage}
        className="ml-5 p-1 bg-emerald-400 rounded-lg border"
      >
        send
      </button>
    </div>
  );
};

export default Chat;
