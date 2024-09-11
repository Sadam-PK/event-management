import { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "../components/EventCard";
import { useNavigate } from "react-router-dom";

export default function MyEvent() {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;
  const navigate = useNavigate();

  const handleOnClick = (id) => {
    navigate("/event/" + id);
  };

  const fetchEvents = async (page) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/organizer/my_events?page=${page}&limit=${limit}`,
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

  useEffect(() => {
    fetchEvents(currentPage); // Fetch events for the current page
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
    <div className="p-5 flex flex-col items-center">
      <h1 className="font-bold text-xl border-b p-2">My Events</h1>
      <div className="flex gap-5 pt-10 flex-wrap">
        {events.length === 0 ? (
          <p>You haven't created any event..</p>
        ) : (
          events.map((event, i) => (
            <EventCard
              key={i}
              event={event}
              onClick={() => handleOnClick(event._id)}
            />
          ))
        )}
      </div>
      {/* -------- previous and current pages ---------- */}
      {!events
        ? ""
        : events.length > 0 && (
            <div className="flex justify-center items-center gap-3 mt-10">
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
          )}
    </div>
  );
}
