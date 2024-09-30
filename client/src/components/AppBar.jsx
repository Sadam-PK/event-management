import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, userMe } from "../store/features/user/userSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function AppBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.user);
  const [isNotification, setIsNotification] = useState(false); // check new notification toggle
  const [notifications, setNotifications] = useState([]); // event notifications array of the user

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/attendee/notification",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // console.log("Fetched Notifications:", response.data); // Check for duplicates here
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    // Check if the user session is valid
    if (status === "idle") {
      dispatch(userMe());
    } else if (status === "success" && !user) {
      navigate("/login");
    }

    // Fetch notifications if user exists
    if (user) {
      fetchNotifications();
    }
  }, [user, status, navigate, dispatch]);

  // Filter unread and read notifications
  const unreadNotifications = notifications.filter((e) => !e.isRead);
  const readNotifications = notifications.filter((e) => e.isRead);

  // logout the user
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // notification toggle handler
  const toggleNotification = () => {
    setIsNotification(!isNotification);
  };

  // Mark notification as read
  const handleReadNotification = async (id) => {
    try {
      await axios.patch(
        `http://localhost:3000/attendee/notifications/${id}`,
        { isRead: true },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Update the local state after marking as read
      setNotifications((prevEvents) =>
        prevEvents.map((e) => (e._id === id ? { ...e, isRead: true } : e))
      );
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  // If user is not logged in, show login/signup links
  if (!user) {
    return (
      <div className="bg-emerald-300 p-3 flex justify-between">
        <Link to="/" className="font-bold">
          Event Management
        </Link>
        <ul className="flex flex-row gap-5">
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/signup">Signup</Link>
          </li>
        </ul>
      </div>
    );
  }

  // Main AppBar UI for logged-in users
  return (
    <div>
      <div className="bg-emerald-300 p-3 flex justify-between items-center relative">
        <Link to="/" className="font-bold">
          Event Management
        </Link>

        <ul className="flex flex-row gap-5">
          <li>
            {/* Show bell icon with different colors based on unread notifications */}
            {unreadNotifications.length === 0 ? (
              <FontAwesomeIcon
                icon={faBell}
                className="text-xl text-teal-700 hover:text-emerald-600 cursor-pointer"
                onClick={toggleNotification}
              />
            ) : (
              <FontAwesomeIcon
                icon={faBell}
                className="text-xl text-red-800 hover:text-emerald-600 cursor-pointer"
                onClick={toggleNotification}
              />
            )}
          </li>
          <li>{user?.username}</li>
          <li
            className="cursor-pointer w-[6vw] text-center bg-emerald-600 text-white 
            rounded-lg hover:bg-emerald-500 hover:transition duration-500"
            onClick={handleLogout}
          >
            Logout
          </li>
        </ul>
      </div>

      {/* Notifications dropdown */}
      {isNotification && (
        <div className="h-[80vh] w-80 absolute bg-emerald-200 right-20 p-2 border z-10">
          <h3 className="font-bold">Unread Notifications</h3>
          {unreadNotifications.length > 0 ? (
            <ul>
              {unreadNotifications.map((e) => (
                <li
                  key={e._id}
                  className="px-2 py-3 flex justify-between items-center border-b 
                  border-gray-500 cursor-pointer hover:text-gray-900 text-gray-700"
                  onClick={() => handleReadNotification(e._id)}
                >
                  {e?.title}
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    className="text-blue-600 cursor-pointer hover:text-red-700"
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p>No unread notifications</p>
          )}

          <h3 className="font-bold mt-4">Read Notifications</h3>
          {readNotifications.length > 0 ? (
            <ul>
              {readNotifications.map((e) => (
                <li
                  key={e._id}
                  className="px-2 py-3 flex justify-between items-center border-b
                   border-gray-300 text-gray-500"
                >
                  {e?.title}
                </li>
              ))}
            </ul>
          ) : (
            <p>No read notifications</p>
          )}
        </div>
      )}
    </div>
  );
}
