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
  const [notification, setNotification] = useState(false); // event notification
  const [newEvent, setNewEvent] = useState([]); // event notification data]

  const unReadNotifications = newEvent.filter((e) => e.isRead === false);
  console.log("filter = >>>> " + unReadNotifications);

  useEffect(() => {
    if (status === "idle") {
      dispatch(userMe());
    } else if (status === "success" && !user) {
      navigate("/login");
    }

    fetchNotifications();
  }, [user, status, navigate, dispatch]);

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
      setNewEvent(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // logout the user
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // notification handle button

  const handleNotification = () => {
    setNotification(!notification);
  };

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

  return (
    <div>
      <div className="bg-emerald-300 p-3 flex justify-between items-center relative">
        <Link to="/" className="font-bold">
          Event Management
        </Link>

        {/* ------ show bell RED or GREEN ------- */}
        <ul className="flex flex-row gap-5">
          <li>
            {unReadNotifications.length === 0 ? (
              <FontAwesomeIcon
                icon={faBell}
                className="text-xl text-teal-700 hover:text-emerald-600 cursor-pointer"
                onClick={handleNotification}
              />
            ) : (
              <FontAwesomeIcon
                icon={faBell}
                className="text-xl text-red-600 hover:text-emerald-600 cursor-pointer"
                onClick={handleNotification}
              />
            )}
          </li>
          <li>{user?.username}</li>
          <li className="cursor-pointer" onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </div>
      {console.log("unread = " + unReadNotifications.length)}
      {notification && (
        <div
          className="h-[80vh] w-80 absolute bg-emerald-200 right-20
        p-2 border"
        >
          {unReadNotifications.map((e, i) => {
            return (
              <ul className="">
                {/* showing unRead notifications only */}
                {unReadNotifications && newEvent ? (
                  <li
                    key={i}
                    className="px-2 py-3 flex justify-between items-center border-b
                border-gray-500 cursor-pointer hover:text-gray-900 text-gray-700"
                    onClick={""}
                  >
                    {e?.title}{" "}
                    <FontAwesomeIcon
                      icon={faCircleXmark}
                      className="text-blue-600 cursor-pointer hover:text-red-700"
                    />
                  </li>
                ) : (
                  <li key={i}></li>
                )}
              </ul>
            );
          })}
        </div>
      )}
    </div>
  );
}
