import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CustomButton from "../components/customButton";

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

  const handleJoinClick = async () => {
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
        toast("Event Joined");
      } else {
        console.error("Error joining event:", data.message);
        toast.warning("User has already joined..");
      }
    } catch (error) {
      console.error("Error joining event:", error);
      toast.error(error);
    }
  };

  const handleEditClick = () => {
    alert("Edit");
  };

  const handleDeleteClick = () => {
    alert("Delete");
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
      <div className="flex gap-2">
        <CustomButton name="Join" onClick={handleJoinClick} />
        <CustomButton name="Edit" onClick={handleEditClick} />
        <CustomButton name="Delete" onClick={handleDeleteClick} />
      </div>
    </div>
  );
}
