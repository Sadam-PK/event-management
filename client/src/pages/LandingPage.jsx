import { useEffect, useState } from "react";
import axios from "axios";
import OrganizerPanel from "../pages/OrganizerPanel";
import AttendeePanel from "./AttendeePanel";
import Login from "./Login";


export default function LandingPage() {
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(response.data);
        // console.log(response.data);
        //   navigate("/");
        // Accessing the correct data field
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchUser();
  }, []);
  // console.log(user?.role);
  if (user?.role == "organizer") {
    return <OrganizerPanel />;
  }
  if (user?.role == "attendee") {
    return <AttendeePanel />;
  }

  return <Login />;
}
