import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEventsThunk,
  setCurrentPage,
} from "../store/features/events/eventSlice";
import EventCard from "../components/EventCard";
import { useNavigate } from "react-router-dom";

export default function EventsList() {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.event.events);
  const currentPage = useSelector((state) => state.event.currentPage);
  const totalPages = useSelector((state) => state.event.totalPages);
  const isLoading = useSelector((state) => state.event.isLoading);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    dispatch(
      fetchEventsThunk({
        page: 1,
        query,
        sortBy: "createdAt",
        sortOrder: "asc",
        limit: 6,
      })
    );
    setQuery("");
  };

  const handleSortChange = (e) => {
    const [field, order] = e.target.value.split(":");
    dispatch(
      fetchEventsThunk({
        page: 1,
        query,
        sortBy: field,
        sortOrder: order,
        limit: 6,
      })
    );
  };

  useEffect(() => {
    dispatch(
      fetchEventsThunk({
        page: currentPage,
        query: "",
        sortBy: "createdAt",
        sortOrder: "asc",
        limit: 6,
      })
    );
  }, [dispatch, currentPage]);

  const handleClick = (id) => {
    navigate(`/event/${id}`);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      dispatch(setCurrentPage(currentPage - 1));
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      dispatch(setCurrentPage(currentPage + 1));
    }
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
            className="border outline-none p-2"
          />
          <button
            onClick={handleSearch}
            className="border outline-none p-2 rounded-r-xl
            bg-emerald-400 hover:bg-transparent hover:text-emerald-500"
          >
            Search
          </button>
        </div>
        <div className="ml-4 rounded-sm">
          <select
            onChange={handleSortChange}
            className="border outline-none p-2"
          >
            <option value="createdAt:asc">Oldest</option>
            <option value="createdAt:desc">Latest</option>
            <option value="title:asc">Ascending</option>
            <option value="title:desc">Descending</option>
          </select>
        </div>
      </div>
      <h2 className="font-bold text-xl">Events List</h2>
      <div className="flex flex-wrap gap-3 justify-center">
        {events.length !== 0
          ? events.map((e) => (
              <EventCard
                key={e._id}
                event={e}
                onClick={() => handleClick(e._id)}
              />
            ))
          : "Not available.."}
      </div>

      {/* Pagination controls */}
      {events.length > 0 && (
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
      )}
    </div>
  );
}
