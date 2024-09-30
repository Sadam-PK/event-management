import React, { useState, useEffect, useRef } from "react";
import axios from "axios"; // For fetching old messages
import {
  faCircleRight,
  faMessage,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
// import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function Chat({ eventId }) {
  const [ws, setWs] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const bottomRef = useRef(null);  // Create a ref for the last message

  useEffect(() => {
    if (!eventId) return;
    const token = localStorage.getItem("token");
    const socket = new WebSocket(`ws://localhost:3000?token=${token}`);

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
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching previous messages:", error);
      }
    };

    fetchMessages();

    socket.onopen = () => {
      console.log("Connected to WebSocket");
      socket.send(JSON.stringify({ eventId }));
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
  }, [eventId]);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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

  return (
    <div className="absolute -bottom-12 right-0 mr-10">
      <button onClick={toggleChat}>
        {isExpanded ? (
          <FontAwesomeIcon
            icon={faMinus}
            className="p-1 bg-blue-700 text-white rounded-full hover:bg-red-400
            hover:duration-500"
            title="Close"
          />
        ) : (
          <FontAwesomeIcon
            icon={faMessage}
            size="2x"
            className="p-6 bg-blue-700 rounded-full text-white hover:bg-blue-900
            hover:transition duration-500"
            title="Chat"
          />
        )}
      </button>

      {isExpanded && (
        <div
          className="bg-gray-100 border border-gray-500 w-[30vw] h-[70vh] p-5 mt-2 
        justify-between rounded-xl flex flex-col"
        >
          <h2 className="py-2 font-bold border-b">Event Chat</h2>

          <div className="h-screen mb-2 overflow-y-auto border">
            {messages?.map((msg, index) => (
              <p key={index}>
                <strong>{msg?.sender?.username} </strong> {msg?.content}
              </p>
            ))}
            <div ref={bottomRef} /> {/* Empty div to track the bottom */}
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
