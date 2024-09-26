import {
  faCircleRight,
  faMessage,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import axios from "axios"; // For fetching old messages

export default function Chat({ eventId }) {
  const [ws, setWs] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!eventId) return;
    const token = localStorage.getItem("token");
    const socket = new WebSocket(`ws://localhost:3000?token=${token}`);

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
        // console.log("Fetched Messages: ", response.data);
        setMessages(response.data); // Set messages with sender usernames
      } catch (error) {
        console.error("Error fetching previous messages:", error);
      }
    };

    fetchMessages();

    // WebSocket setup
    // const socket = new WebSocket(`ws://localhost:3000?token=${token}`);

    socket.onopen = () => {
      console.log("Connected to WebSocket");
      socket.send(JSON.stringify({ eventId }));
    };

    socket.onmessage = (event) => {
      const incomingMessage = JSON.parse(event.data);
      // console.log("Incoming WebSocket Message: ", incomingMessage);
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

  const sendMessage = (e) => {
    e.preventDefault();
    if (ws && message) {
      const messagePayload = {
        eventId: eventId,
        text: message,
      };

      ws.send(JSON.stringify(messagePayload));
      setMessage("");
    }
  };

  const toggleChat = () => {
    setIsExpanded(!isExpanded);
  };

  // console.log("Messages=>>>> ", messages);

  return (
    <div className="absolute -bottom-12 right-0 mr-10">
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

      {isExpanded && (
        <div className="bg-gray-100 border border-gray-500 w-[30vw] h-[70vh] p-5 mt-2 
        justify-between rounded-xl flex flex-col">
          <h2 className="py-2 font-bold border-b">Event Chat</h2>

          <div className="h-screen mb-2 overflow-y-auto border">
            {messages?.map((msg, index) => (
              <p key={index}>
                <strong>{msg?.sender?.username} </strong> {msg?.content}
              </p>
            ))}
          </div>

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
}
