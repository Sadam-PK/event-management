// CreateEvent.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
// import { eventSchema } from "../../../common/zodSchema";
import { eventSchema } from "@sadamccr/eventcommon";
import CustomInput from "../components/customInput";
import { z } from "zod";
import { Audio } from "react-loader-spinner";
import CustomButton from "../components/customButton";

export default function CreateEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null); // Initialize as null
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [maxAttendees, setMaxAttendees] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleTitleChange = (event) => setTitle(event.target.value);
  const handleDescriptionChange = (event) => setDescription(event.target.value);
  const handleLocationChange = (event) => setLocation(event.target.value);
  const handleDateChange = (event) => setDate(event.target.value);

  const handleTimeChange = (event) => {
    const time24 = event.target.value;
    setTime(time24); // Store the time in 24-hour format
  };

  const handleMaxAttendeesChange = (event) =>
    setMaxAttendees(event.target.value);
  const handleFileChange = (event) => setFile(event.target.files[0]);

  // event creation handle
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Convert maxAttendees to a number
    const maxAttendeesNumber = Number(maxAttendees);

    // Prepare form data
    const formData = {
      title,
      description,
      location,
      date,
      time,
      maxAttendees: maxAttendeesNumber,
    };

    try {
      // Validate form data
      eventSchema.parse(formData);

      const formDataToSend = new FormData();
      formDataToSend.append("title", title);
      formDataToSend.append("description", description);
      formDataToSend.append("location", location);
      formDataToSend.append("date", date);
      formDataToSend.append("time", time);
      formDataToSend.append("maxAttendees", maxAttendeesNumber);
      if (file) {
        formDataToSend.append("photo", file);
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const response = await axios.post(
        "http://localhost:3000/organizer/create_event",
        formDataToSend,
        config
      );

      if (response.status === 201) {
        toast.success("Event Created...");
        navigate("/");
      } else {
        toast.error("Error creating event: " + response.data.error);
      }
      setLoading(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Display validation errors
        error.errors.forEach((err) => toast.error(err.message));
      } else {
        console.error(
          "Error creating event:",
          error.response ? error.response.data : error.message
        );
        toast.error(
          "Error creating event: " +
            (error.response ? error.response.data.error : error.message)
        );
      }
      setLoading(false);
    }
  };

  const today = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split("T")[0];
  };
  if (loading == true) {
    return (
      <div className="justify-center items-center flex flex-col h-screen gap-2">
        <Audio height="80" width="80" color="green" ariaLabel="loading" />
        <div>creating..</div>
      </div>
    );
  }
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
        {/* <button
          className="bg-emerald-400 p-2 border rounded-md w-32 hover:bg-white
          hover:border-2 hover:border-emerald-500 hover:text-emerald-700"
          onClick={handleCreateEvent}
        >
          Create Event
        </button> */}
        <CustomButton 
        name='Create Event'
        className="bg-emerald-400 p-2 border rounded-md w-32 hover:bg-white
        hover:border-2 hover:border-emerald-500 hover:text-emerald-700"
        onClick={handleCreateEvent}/>
      </div>
    </div>
  );
}
