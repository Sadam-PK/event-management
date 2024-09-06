import { useNavigate } from "react-router-dom";

export default function ViewEvents() {
  const navigate = useNavigate();

  const handleViewEvents = () => {
    navigate("/events");
  };

  return (
    <div
      className="h-[40vh] border items-center justify-center 
      flex hover:border-gray-500
      font-bold text-2xl text-gray-500 rounded-xl"
      onClick={handleViewEvents}
    >
      View Events
    </div>
  );
}
