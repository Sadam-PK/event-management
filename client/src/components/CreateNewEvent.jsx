import { useNavigate } from "react-router-dom";

export default function CreateNewEvent() {
  const navigate = useNavigate();
  const handleCreateEvent = () => {
    navigate("/create-event");
  };

  return (
    <div
      className="h-[40vh] border items-center justify-center flex hover:border-gray-500"
      onClick={handleCreateEvent}
    >
      Create Event
    </div>
  );
}
