import { useState, useEffect } from "react";
import CustomInput from "../components/customInput";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function UpdateEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [maxAttendees, setMaxAttendees] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch the existing event details --- to fill update input fields
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/organizer/events/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          const event = response.data;
          setTitle(event.title);
          setDescription(event.description);
          setLocation(event.location);
          setMaxAttendees(event.maxAttendees);
          setDate(event.date);
          setTime(event.time);
          setFile(event.file);
          // Optionally, set the file if you want to show the existing image
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleTitleChange = (event) => setTitle(event.target.value);
  const handleDescriptionChange = (event) => setDescription(event.target.value);
  const handleLocationChange = (event) => setLocation(event.target.value);
  const handleDateChange = (event) => setDate(event.target.value);
  const handleTimeChange = (event) => setTime(event.target.value);
  const handleMaxAttendeesChange = (event) =>
    setMaxAttendees(event.target.value);
  const handleFileChange = (event) => setFile(event.target.files[0]);

  const handleUpdateEvent = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("time", time);
    formData.append("date", date);
    formData.append("maxAttendees", maxAttendees);
    // if (file) {
    formData.append("photo", file); // Only append photo if a new file is selected
    // }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    try {
      const response = await axios.put(
        `http://localhost:3000/organizer/update_event/${id}`,
        formData,
        config
      );

      if (response.status === 200) {
        // console.log("Event updated successfully:", response.data);
        toast("Event Updated");
        navigate("/");
      } else {
        console.error("Error updating event:", response.data.error);
      }
    } catch (error) {
      console.error(
        "Error updating event:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const today = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Adds one day to the current date
    const oneDayAhead = today.toISOString().split("T")[0];
    return oneDayAhead;
  };

  return (
    <div className="flex flex-col items-center h-screen justify-center">
      <h2 className="font-bold mb-10 text-xl">Update Event</h2>
      <div className="flex flex-col w-[30vw] gap-3 items-center">
        <CustomInput
          placeholder="Title"
          value={title}
          onChange={handleTitleChange}
        />
        <CustomInput
          placeholder="Description"
          value={description}
          onChange={handleDescriptionChange}
        />
        <input
          type="time"
          id="time"
          value={time}
          onChange={handleTimeChange}
          className="border p-3"
        />
        <input
          type="text"
          id="location"
          value={location}
          onChange={handleLocationChange}
          placeholder="Enter location"
          className="border p-3"
        />
        <input
          type="date"
          id="date"
          value={date}
          onChange={handleDateChange}
          min={today()}
          className="border p-3"
        />
        <input
          type="number"
          id="maxAttendees"
          value={maxAttendees}
          onChange={handleMaxAttendeesChange}
          className="border p-3"
          placeholder="Max Attendees"
        />
        <input type="file" onChange={handleFileChange} />

        <button
          className="bg-emerald-400 p-2 border rounded-md w-32"
          onClick={handleUpdateEvent}
        >
          Update Event
        </button>
      </div>
    </div>
  );
}
