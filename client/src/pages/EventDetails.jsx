import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/user/events/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEvent();
  }, []);

  const handleOnClick = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/user/events/${id}/attendees/`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Successfully joined the event:", data);
        // You can redirect or update UI here as needed
      } else {
        console.error("Error joining event:", data.message);
      }
    } catch (error) {
      console.error("Error joining event:", error);
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold">Event details</h2>
      <div className="flex flex-col">
        <div>
          <h2>Event Title: {event?.title}</h2>
        </div>
        <div>Organizer: {event?.createdBy?.username}</div>
        {/* <div>Attendees: {event?.attendees}</div> */}
      </div>
      <button
        className="w-20 h-8 rounded bg-emerald-400"
        onClick={handleOnClick}
      >
        Join
      </button>
    </div>
  );
}
