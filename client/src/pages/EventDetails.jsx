import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CustomButton from "../components/customButton";
import { useNavigate } from "react-router-dom";
import moment from "moment";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // ----- Fetch event and user details -----
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

  // ------ join event as attendee --------
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
      } else if (response.status === 401) {
        toast.warning("No more slots available");
      } else {
        // console.error("Error joining event:", data.message);
        toast.warning("User has already joined.");
      }
    } catch (error) {
      console.error("Error joining event:", error);
      toast.error("An error occurred.");
    }
  };

  // ----- edit event as organzier ------
  const handleEditClick = () => {
    navigate(`/update-event/${event._id}`);
  };

  // ------ delete event -------
  const handleDeleteClick = async () => {
    // alert("Delete");
    try {
      const response = await fetch(
        `http://localhost:3000/user/delete_event/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        // console.log("Successfully deleted the event:", data);
        toast.info("Event Deleted");
        navigate("/my-event");
      } else {
        console.error("Error deleting the event:", data.message);
        toast.warning("Error deleting.");
      }
    } catch (error) {
      console.error("Error occoured:", error);
      toast.error("An error occurred.");
    }
  };

  // ---- Check if the user is the organizer of the event ----
  const isOrganizer = user && event?.createdBy?.username === user.username;
  const isAdmin = user?.role === "admin";

  return (
    <div className=" flex flex-row mx-auto h-auto p-10 gap-2">
      <div className="flex flex-col space-y-5 w-[60vw] p-5 border">
        <div className="">Event Title: {event?.title}</div>
        <div className="">Details: {event?.description}</div>
        <div>Organizer: {event?.createdBy?.username}</div>
        <div>Time: {event?.time}</div>
        <div>Date: {moment(event?.date).format("L")}</div>
        <div>Location: {event?.location}</div>
        <div>Capacity: {event?.maxAttendees}</div>
        {isOrganizer && (
          <div>
            Attendees:
            {event?.attendees.map((e, i) => {
              return <div key={i}>{e.username}</div>;
            })}
          </div>
        )}

        {!isOrganizer && !isAdmin && (
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
      <div className="flex w-[40vw] border items-center justify-center p2 ">
        <img src={event?.imgPath} alt="" className="overflow-hidden" />
      </div>
    </div>
  );
}
