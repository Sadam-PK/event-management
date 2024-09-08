import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, user } from "../store/features/user/userSlice";

export default function AppBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: currentUser, status } = useSelector((state) => state.user);

  useEffect(() => {
    if (status === "idle") {
      dispatch(user());
    }
    if (!currentUser && status === "success") {
      navigate("/login");
    }
  }, [currentUser, status, navigate, dispatch]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
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
        <li>{currentUser?.username}</li>
        <li
          className="cursor-pointer"
          onClick={() => {
            dispatch(logout());
            navigate("/login");
          }}
        >
          Logout
        </li>
      </ul>
    </div>
  );
}
