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

  return (
    <div className="p-5">
      <h2 className="text-xl">Event details</h2>
      <div className="flex flex-col">
        <div>
          <h2>Event Title: {event?.title}</h2>
        </div>
        <div>Organizer: {event?.createdBy?.username}</div>
        {/* <div>Attendees: {event?.attendees}</div> */}
      </div>
    </div>
  );
}
