import axios from "axios";
import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import SearchInput from "../components/SearchInput";
import { useNavigate } from "react-router-dom";

export default function EventsList() {
  const [events, setEvents] = useState([]);

  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/event/${id}`);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user/events`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setEvents(response.data);
        console.log(response.data);
        // Accessing the correct data field
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="p-10 space-y-5">
      <div className="justify-center flex">
        <SearchInput placeholder="Search Event..." />
      </div>    
      <h2>Events List</h2>
      <div className="flex gap-3">
        {events.map((e, i) => (
          <EventCard key={i} event={e} onClick={() => handleClick(e._id)} />
        ))}
      </div>
    </div>
  );
}
