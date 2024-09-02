import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CustomButton from "../components/customButton";
import { useNavigate } from "react-router-dom";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // Fetch event and user details
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

    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:3000/user/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchEvent();
    fetchUser();
  }, [id]);

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
        toast("Event Joined");
      } else {
        console.error("Error joining event:", data.message);
        toast.warning("User has already joined.");
      }
    } catch (error) {
      console.error("Error joining event:", error);
      toast.error("An error occurred.");
    }
  };

  const handleEditClick = () => {
    navigate("/update-event")
  };

  const handleDeleteClick = () => {
    alert("Delete");
  };

  // Check if the user is the organizer of the event
  const isOrganizer = user && event?.createdBy?.username === user.username;

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold">Event details</h2>
      <div className="flex flex-col">
        <div>
          <h2>Event Title: {event?.title}</h2>
        </div>
        <div>Organizer: {event?.createdBy?.username}</div>
      </div>

      {!isOrganizer && (
        <div>
          <div className="flex gap-2">
            <CustomButton name="Join" onClick={handleJoinClick} />
          </div>
        </div>
      )}
      {isOrganizer && (
        <div className="space-x-2">
          <CustomButton name="Edit" onClick={handleEditClick} />
          <CustomButton name="Delete" onClick={handleDeleteClick} />
        </div>
      )}
    </div>
  );
}
