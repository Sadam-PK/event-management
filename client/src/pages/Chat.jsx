import {
  faCircleRight,
  faMessage,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";

const Chat = ({ eventId }) => {
  const [ws, setWs] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false); // To control expand/collapse

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(`token -----> ${token}`);

    const socket = new WebSocket(`ws://localhost:3000?token=${token}`);

    socket.onopen = () => {
      console.log("Connected to WebSocket");
    };

    socket.onmessage = (event) => {
      const incomingMessage = JSON.parse(event.data);
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
  }, []);
  console.log("eventId ------>>> " + eventId);

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

  return (
    <div className="absolute bottom-0 right-0 mr-10">
      {/* Button to toggle chat visibility */}
      <button
        onClick={toggleChat}
        className="bg-blue-600 text-white rounded-full p-2"
      >
        {isExpanded ? (
          <FontAwesomeIcon icon={faMinus} />
        ) : (
          <FontAwesomeIcon icon={faMessage} />
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
          <div className=" h-[18vh] mb-2">
            {messages.map((msg, index) => (
              <p key={index}>
                <strong>{msg.sender}:</strong> {msg.message}
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
