import axios from "axios";
import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import { useNavigate } from "react-router-dom";

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(3);
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/event/${id}`);
  };

  const fetchEvents = async (page, query = "") => {
    try {
      const response = await axios.get(
        "http://localhost:3000/user/search_events",
        {
          params: {
            q: query,
            page: page,
            limit: limit,
          },
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
    fetchEvents(currentPage, isSearching ? query : "");
  }, [currentPage, isSearching, query]);

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

  const handleSearch = () => {
    setIsSearching(true);
    setCurrentPage(1); // Reset to the first page for search
    fetchEvents(1, query);
  };

  return (
    <div className="p-10 space-y-5">
      <div className="justify-center flex">
        <div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events"
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>
      <h2 className="font-bold text-xl">Events List</h2>
      <div className="flex flex-wrap gap-3">
        {events.map((e) => (
          <EventCard key={e._id} event={e} onClick={() => handleClick(e._id)} />
        ))}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center items-center gap-5 mt-10">
        <button
          className="btn btn-primary bg-emerald-400 w-16 h-9 rounded-md cursor-pointer
          hover:bg-white hover:border-2 hover:border-emerald-500 hover:text-emerald-600"
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
