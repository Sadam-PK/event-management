import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/features/auth/authSlice";

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
      <h2 className="font-bold">
        <Link to="/">Event Management</Link>
      </h2>
      <ul className="flex flex-row gap-5">
        <li>{user.username}</li>
        <li
          className="cursor-pointer"
          onClick={() => {
            dispatch(logout()); // Dispatch the logout action to clear Redux state
            navigate("/login");
          }}
        >
          Logout
        </li>
      </ul>
    </div>
  );
}
