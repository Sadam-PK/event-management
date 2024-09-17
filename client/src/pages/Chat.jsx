import {
  faCircleRight,
  faMessage,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import axios from "axios"; // For fetching old messages

const Chat = ({ eventId }) => {
  const [ws, setWs] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false); // To control expand/collapse

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Fetch previous messages from the database using an API
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/user/events/${eventId}/messages`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Fetched Messages: ", response.data); // Debugging
        setMessages(response.data); // Assuming the API returns an array of messages
      } catch (error) {
        console.error("Error fetching previous messages:", error);
      }
    };

    fetchMessages(); // Fetch previous messages when the component mounts

    // WebSocket setup
    const socket = new WebSocket(`ws://localhost:3000?token=${token}`);

    socket.onopen = () => {
      console.log("Connected to WebSocket");
    };

    socket.onmessage = (event) => {
      const incomingMessage = JSON.parse(event.data);
      console.log("Incoming WebSocket Message: ", incomingMessage); // Debugging
      setMessages((prevMessages) => [...prevMessages, incomingMessage]);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error", error);
    };

    socket.onclose = (event) => {
      console.log("WebSocket closed", event.reason);
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [eventId]);


  const sendMessage = () => {
    if (ws && message) {
      const messagePayload = {
        eventId: eventId,
        text: message,
      };

      ws.send(JSON.stringify(messagePayload));
      setMessage("");
    }
  };

  // Toggle between expanded and collapsed states
  const toggleChat = () => {
    setIsExpanded(!isExpanded);
  };

  console.log('Messages: ', messages); // Debugging

  return (
    <div className="absolute -bottom-12 right-0 mr-10">
      {/* Button to toggle chat visibility */}
      <button onClick={toggleChat}>
        {isExpanded ? (
          <FontAwesomeIcon
            icon={faMinus}
            className="p-1 bg-blue-700 text-white rounded-full"
          />
        ) : (
          <FontAwesomeIcon
            icon={faMessage}
            size="2x"
            className="p-6 bg-blue-700 rounded-full text-white"
          />
        )}
      </button>

      {/* Chat box with conditional rendering based on `isExpanded` */}
      {isExpanded && (
        <div
          className="bg-gray-100 border border-gray-500 w-[30vw] h-[70vh] p-5 mt-2
        justify-between rounded-xl flex flex-col"
        >
          <h2 className="py-2 font-bold border-b">Event Chat</h2>

          {/* Display incoming messages */}
          <div className="h-screen mb-2 overflow-y-auto border">
            {messages.map((msg, index) => (
              <p key={index}>
                <strong>{msg.sender || "anonymous"}:</strong> {msg.content}
              </p>
            ))}
          </div>

          {/* Input to send a message */}
          <div className="flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
              className="border outline-none p-1 w-full"
            />
            <FontAwesomeIcon
              icon={faCircleRight}
              size="2x"
              className="mx-5 text-emerald-600 cursor-pointer"
              onClick={sendMessage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
