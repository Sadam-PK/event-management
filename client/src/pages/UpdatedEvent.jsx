import { useState, useEffect } from "react";
import CustomInput from "../components/customInput";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";


export default function UpdateEvent() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch the existing event details (optional, if you want to pre-fill the form)
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user/events/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.status === 200) {
          const event = response.data;
          setTitle(event.title);
          // Optionally, set the file if you want to show the existing image
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleTitleChange = (event) => setTitle(event.target.value);
  const handleFileChange = (event) => setFile(event.target.files[0]);

  const handleUpdateEvent = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    if (file) {
      formData.append("photo", file); // Only append photo if a new file is selected
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    try {
      const response = await axios.put(
        `http://localhost:3000/user/update_event/${id}`,
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

  return (
    <div className="flex flex-col items-center h-screen justify-center">
      <h2 className="font-bold mb-10 text-xl">Update Event</h2>
      <div className="flex flex-col w-[30vw] gap-3 items-center">
        <CustomInput
          placeholder="Title"
          value={title}
          onChange={handleTitleChange}
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
