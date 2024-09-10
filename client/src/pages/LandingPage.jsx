import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, userMe } from "../store/features/user/userSlice";
import { useEffect } from "react";
import OrganizerPanel from "./OrganizerPanel";
import AttendeePanel from "./AttendeePanel";
import Login from "./Login";
import Dashboard from "./admin/Dashboard";

export default function LandingPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.user);

  useEffect(() => {
    // console.log(currentUser?.username);

    if (status === "idle") {
      dispatch(userMe());
    }
    if (!user && status === "success") {
      navigate("/login");
    }
  }, [user, status, navigate, dispatch]);

  if (user?.role == "admin") {
    return <Dashboard />;
  }
  if (user?.role == "organizer") {
    return <OrganizerPanel />;
  }
  if (user?.role == "attendee") {
    return <AttendeePanel />;
  }

  return <Login />;
}
