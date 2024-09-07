import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../store/features/auth/authSlice";

export default function AppBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="bg-emerald-300 p-3 flex justify-between">
        <h2 className="font-bold">
          <Link to="/">Event Management</Link>
        </h2>
        <ul className="flex flex-row gap-5">
          <li>
            <Link to="/login">login</Link>
          </li>
          <li>
            <Link to="/signup">signup</Link>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div className="bg-emerald-300 p-3 flex justify-between">
      <h2 className="font-bold">
        <a href="/">Event Management</a>
      </h2>
      <ul className="flex flex-row gap-5">
        <li>{user.username}</li>
        <li
          className="cursor-pointer"
          onClick={() => {
            localStorage.removeItem("token"); // Remove token from localStorage
            dispatch(login(null)); // Clear user state in Redux
            navigate("/login");
          }}
        >
          logout
        </li>
      </ul>
    </div>
  );
}
