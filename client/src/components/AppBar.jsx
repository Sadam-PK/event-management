import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, userMe } from "../store/features/user/userSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

export default function AppBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.user);
  const [notification, setNotification] = useState(false); // event notification
  const [newEvent, setNewEvent] = useState([]); // event notification data

  useEffect(() => {
    if (status === "idle") {
      dispatch(userMe());
    } else if (status === "success" && !user) {
      navigate("/login");
    }
  }, [user, status, navigate, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // notification handle button

  const handleNotification = () => {
    setNotification(!notification);
    setNewEvent([])
  };

  if (!user) {
    return (
      <div className="bg-emerald-300 p-3 flex justify-between">
        <Link to="/" className="font-bold">
          Event Management
        </Link>
        {/* <a href="/" className="font-bold">
          Event Management
        </a> */}
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
        <ul className="flex flex-row gap-5">
          <li>
            {newEvent.length === 0 ? (
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
      {notification && (
        <div
          className="h-[80vh] w-80 absolute bg-emerald-200 right-20
        p-2 border"
        >
          notifications
          {newEvent.map((e) => {
            return <p>{e}</p>;
          })}
        </div>
      )}
    </div>
  );
}
