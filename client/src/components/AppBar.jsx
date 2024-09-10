import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, userMe } from "../store/features/user/userSlice";

export default function AppBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.user);

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
    <div className="bg-emerald-300 p-3 flex justify-between">
      <Link to="/" className="font-bold">
        Event Management
      </Link>
      {/* <a href="/" className="font-bold">
        Event Management
      </a> */}
      <ul className="flex flex-row gap-5">
        <li>{user?.username}</li>
        <li className="cursor-pointer" onClick={handleLogout}>
          Logout
        </li>
      </ul>
    </div>
  );
}
