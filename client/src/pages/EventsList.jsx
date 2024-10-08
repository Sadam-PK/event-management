import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEventsThunk,
  setCurrentPage,
} from "../store/features/events/eventSlice";
import EventCard from "../components/EventCard";
import { useNavigate, useLocation } from "react-router-dom";
import Loading from "../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CustomButton from "../components/customButton";
import {
  faArrowLeft,
  faArrowRight,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

export default function EventsList() {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.event.events);
  const currentPage = useSelector((state) => state.event.currentPage);
  const totalPages = useSelector((state) => state.event.totalPages);
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState(
    new URLSearchParams(location.search).get("query") || ""
  );
  const [sortBy, setSortBy] = useState(
    new URLSearchParams(location.search).get("sortBy") || "createdAt"
  );
  const [sortOrder, setSortOrder] = useState(
    new URLSearchParams(location.search).get("sortOrder") || "asc"
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);

    const queryParam = new URLSearchParams(location.search).get("query");
    const sortField =
      new URLSearchParams(location.search).get("sortBy") || "createdAt";
    const sortOrderParam =
      new URLSearchParams(location.search).get("sortOrder") || "asc";

    setSearchQuery(searchQuery || "");
    setSortBy(sortBy);
    setSortOrder(sortOrder);

    dispatch(
      fetchEventsThunk({
        page: currentPage,
        query: queryParam || "",
        sortBy: sortField,
        sortOrder: sortOrderParam,
        limit: 6,
      })
    );
  }, [location.search, dispatch, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();

    // Update URL with the new query and reset to page 1
    navigate(`/?query=${query}`, {
      replace: true,
    });

    // Clear the search input after submission
    setQuery("");
  };

  const handleSortChange = (e) => {
    const [field, order] = e.target.value.split(":");

    setSortBy(field);
    setSortOrder(order);

    // Update URL with the sort information
    navigate(`/?query=${searchQuery}&sortBy=${field}&sortOrder=${order}`, {
      replace: true,
    });
  };

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
    <div className="">
      <div className="bg-emerald-200 px-3 text-sm">Attendee Panel</div>
      {loading ? (
        <Loading />
      ) : (
        <div className="p-10 space-y-5">
          <div className="justify-center flex">
            <div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events"
                className="border outline-none p-2 rounded-l-full indent-3 w-[24vw]"
              />

              <CustomButton
                type="button"
                icon={<FontAwesomeIcon icon={faSearch} width={"3vw"} />}
                onClick={handleSearch}
                className="border outline-none p-2 rounded-r-full bg-emerald-400 hover:bg-transparent
                 hover:text-emerald-500"
              />
            </div>
            <div className="ml-4 rounded-sm">
              <select
                value={`${sortBy}:${sortOrder}`} // Bind to state
                onChange={handleSortChange}
                className="border outline-none p-2"
              >
                <option value="createdAt:asc">Ascending</option>
                <option value="createdAt:desc">Descending</option>
              </select>
            </div>
          </div>
          <h2 className="font-bold text-xl text-gray-700">Events List</h2>
          <div className="flex flex-wrap gap-5 justify-center">
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
            <div className="flex justify-center items-center gap-5 mt-10 py-20">
              <CustomButton
                icon={<FontAwesomeIcon icon={faArrowLeft} />}
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="border border-gray-500 px-3 rounded-xl cursor-pointer hover:border-gray-400"
              />
              <span className="text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
              <CustomButton
                icon={<FontAwesomeIcon icon={faArrowRight} />}
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="border border-gray-500 px-3 rounded-xl cursor-pointer hover:border-gray-400"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

