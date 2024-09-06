import { useState } from "react";
import CustomInput from "../components/customInput";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function CreateEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null); // Initialize as null
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [maxAttendees, setMaxAttendees] = useState("");

  const navigate = useNavigate();

  const handleTitleChange = (event) => setTitle(event.target.value);
  const handleDescriptionChange = (event) => setDescription(event.target.value);
  const handleLocationChange = (event) => setLocation(event.target.value);
  const handleDateChange = (event) => setDate(event.target.value);
  const handleTimeChange = (event) => {
    const time24 = event.target.value;
    setTime(convertTo12HourFormat(time24));
  };
  const handleMaxAttendeesChange = (event) =>
    setMaxAttendees(event.target.value);
  const handleFileChange = (event) => setFile(event.target.files[0]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    // Convert maxAttendees to a number
    const maxAttendeesNumber = Number(maxAttendees);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("date", date);
    formData.append("time", time);
    formData.append("maxAttendees", maxAttendeesNumber);
    if (file) {
      formData.append("photo", file);
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/user/create_event",
        formData,
        config
      );

      if (response.status === 201) {
        toast.success("Event Created...");
        navigate("/");
      } else {
        toast.error("Error creating event: " + response.data.error);
      }
    } catch (error) {
      console.error(
        "Error creating event:",
        error.response ? error.response.data : error.message
      );
      toast.error(
        "Error creating event: " +
          (error.response ? error.response.data.error : error.message)
      );
    }
  };

  const today = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split("T")[0];
  };

  const convertTo12HourFormat = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const adjustedHour = hour % 12 || 12;
    return `${adjustedHour}:${minute < 10 ? "0" + minute : minute} ${period}`;
  };

  return (
    <div className="flex flex-col items-center h-screen justify-center">
      <h2 className="font-bold mb-10 text-xl">Create Event</h2>
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
          className="border p-3 w-[20vw]"
        />
        <input
          type="text"
          id="location"
          value={location}
          onChange={handleLocationChange}
          placeholder="Location"
          className="border p-3 w-[20vw]"
        />
        <input
          type="date"
          id="date"
          value={date}
          onChange={handleDateChange}
          min={today()}
          className="border p-3 w-[20vw]"
        />
        <input
          type="number"
          id="maxAttendees"
          value={maxAttendees}
          onChange={handleMaxAttendeesChange}
          className="border p-3"
          placeholder="Max Attendees"
        />
        <input
          type="file"
          onChange={handleFileChange}
          className="border p-3 w-[20vw]"
        />
        <button
          className="bg-emerald-400 p-2 border rounded-md w-32 hover:bg-white
          hover:border-2 hover:border-emerald-500 hover:text-emerald-700"
          onClick={handleCreateEvent}
        >
          Create Event
        </button>
      </div>
    </div>
  );
}
