import axios from "axios";
import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import SearchInput from "../components/SearchInput";
import { useNavigate } from "react-router-dom";

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 3;
  // const [events, setEvents] = useState([]);

  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/event/${id}`);
  };

  useEffect(() => {
    const fetchEvents = async (page) => {
      try {
        const response = await axios.get(
          `http://localhost:3000/user/events?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setEvents(response.data.events);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents(currentPage);
  }, [currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="p-10 space-y-5">
      <div className="justify-center flex">
        <SearchInput placeholder="Search Event..." />
      </div>
      <h2 className="font-bold text-xl">Events List</h2>
      <div className="flex flex-wrap gap-3">
        {events.map((e, i) => (
          <EventCard key={i} event={e} onClick={() => handleClick(e._id)} />
        ))}
      </div>
      {/* -------- previous and current pages ---------- */}
      <div className="flex justify-center items-center gap-5 mt-10">
        <button
          className="btn btn-primary bg-emerald-400 w-16 h-9 rounded-md cursor-pointer
          hover:bg-white hover:border-2 hover:border-emerald-500 hover:text-emerald-600
          "
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="text-gray-500">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-primary bg-emerald-400 w-16 h-9 rounded-md cursor-pointer
          hover:bg-white hover:border-2 hover:border-emerald-500 hover:text-emerald-600"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
