import { useNavigate } from "react-router-dom";

export default function ViewUsers() {
  const navigate = useNavigate();

  const handleViewUsers = () => {
    navigate("/users-list");
  };

  return (
    <div
      className="h-[40vh] border items-center justify-center flex hover:border-gray-500
      font-bold text-2xl text-gray-500 rounded-xl"
      onClick={handleViewUsers}
    >
      View Users
    </div>
  );
}
