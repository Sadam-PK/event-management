import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../pages/Login";
import axios from "axios";
import Attendee from "../pages/AttendeePanel";

export default function AppBar() {
  const navigate = useNavigate();
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(response.data.username);
        console.log(response.data);
        navigate("/");
        // Accessing the correct data field
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  // console.log("username = "+ user);

  if (!user) {
    return <Login />;
  }

  return (
    <div className="bg-emerald-300 p-3 flex justify-between">
      <h2 className="font-bold">
        <a href="/">Event Management</a>
      </h2>
      <ul className="flex flex-row gap-5">
        <li>{user}</li>
        <li
        className="cursor-pointer"
          onClick={() => {
            localStorage.setItem("token", null);
            setUser({ user: null });
            window.location.reload();
            navigate("/");
          }}
        >
          logout
        </li>
      </ul>
    </div>
  );
}
