import { useState } from "react";
import CustomInput from "../components/customInput";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function UpdateEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const {id} = useParams();

  const navigate = useNavigate();

  const handleTitleChange = (event) => setTitle(event.target.value);
  const handleDescriptionChange = (event) => setDescription(event.target.value);

  const handleCreateEvent = async () => {
    try {
      const response = await fetch(`http://localhost:3000/user/update_event/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          title,
          // description,
        }),
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Event updated successfully:", data);
        navigate("/");
      } else {
        console.error("Error updating event:", data.error);
      }
    } catch (error) {
      console.error("Error updating event:", error);
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
        <CustomInput
          placeholder="Description"
          value={description}
          onChange={handleDescriptionChange}
        />
        <button
          className="bg-emerald-400 p-2 border rounded-md w-32"
          onClick={handleCreateEvent}
        >
          Update Event
        </button>
      </div>
    </div>
  );
}
