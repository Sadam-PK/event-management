import { useNavigate } from "react-router-dom";

export default function CreateEventCard() {
  const navigate = useNavigate();
  const handleCreateEvent = () => {
    navigate("/create-event");
  };

  return (
    <div
      className="h-[40vh] border items-center justify-center flex hover:border-gray-500
      font-bold text-2xl text-gray-500 rounded-xl cursor-pointer shadow-xl"
      onClick={handleCreateEvent}
    >
      Create Event
    </div>
  );
}
