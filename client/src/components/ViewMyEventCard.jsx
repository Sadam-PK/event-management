import { useNavigate } from "react-router-dom";

export default function ViewMyEventCard() {
  const navigate = useNavigate();

  const handleViewMyEvent = () => {
    navigate("/my-event");
  };

  return (
    <div
      className="h-[40vh] border items-center justify-center flex hover:border-gray-500
      font-bold text-2xl text-gray-500 rounded-xl cursor-pointer shadow-xl"
      onClick={handleViewMyEvent}
    >
      My Events
    </div>
  );
}
