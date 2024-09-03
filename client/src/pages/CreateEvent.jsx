import { useState } from "react";
import CustomInput from "../components/customInput";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateEvent() {
  const [title, setTitle] = useState("");
  // const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const navigate = useNavigate();

  const handleTitleChange = (event) => setTitle(event.target.value);
  // const handleDescriptionChange = (event) => setDescription(event.target.value);
  const handleFileChange = (event) => setFile(event.target.files[0]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("photo", file);
    // formData.append("description", description); // if needed

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
        // console.log("Event created successfully:", response.data);
        navigate("/");
      } else {
        console.error("Error creating event:", response.data.error);
      }
    } catch (error) {
      console.error(
        "Error creating event:",
        error.response ? error.response.data : error.message
      );
    }
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
        {/* <CustomInput
          placeholder="Description"
          value={description}
          onChange={handleDescriptionChange}
        /> */}
        <input type="file" onChange={handleFileChange} />
        <button
          className="bg-emerald-400 p-2 border rounded-md w-32"
          onClick={handleCreateEvent}
        >
          Create Event
        </button>
      </div>
    </div>
  );
}
