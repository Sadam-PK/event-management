import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, user } from "../store/features/user/userSlice";

import { useEffect } from "react";
import OrganizerPanel from "./OrganizerPanel";
import AttendeePanel from "./AttendeePanel";
import Login from "./Login";
import Dashboard from "./admin/Dashboard";

export default function LandingPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: currentUser, status } = useSelector((state) => state.user);

  useEffect(() => {
// console.log(currentUser?.username);

    if (status === "idle") {
      dispatch(user());
    }
    if (!currentUser && status === "success") {
      navigate("/login");
    }
  }, [currentUser, status, navigate, dispatch]);


    if (currentUser?.role == "admin") {
      return <Dashboard />;
    }
    if (currentUser?.role == "organizer") {
      return <OrganizerPanel />;
    }
    if (currentUser?.role == "attendee") {
      return <AttendeePanel />;
    }

    return <Login />;
  }