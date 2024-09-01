import { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "../components/EventCard";

export default function MyEvent() {
  const [events, setEvents] = useState([]); // Initialize with an empty array

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/user/my_events",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setEvents(response.data); // Set events data here
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="p-5">
      <h1>My Events</h1>

      <div className="flex gap-5 pt-10">
        {events.length === 0 ? (
          <p>No events found</p>
        ) : (
          events.map((event, i) => (
            // <li key={event._id}>{event.title}</li>
            <EventCard key={i} event={event} />
          ))
        )}
      </div>
    </div>
  );
}
