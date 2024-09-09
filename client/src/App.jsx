import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import Profile from "./pages/Profile";
import UpdateProfile from "./pages/UpdateProfile";
import CreateEvent from "./pages/CreateEvent";
import EventsList from "./pages/EventsList";
import EventDetails from "./pages/EventDetails";
import UsersList from "./pages/admin/UsersList";
import AppBar from "./components/AppBar";
import AttendeePanel from "./pages/AttendeePanel";
import OrganizerPanel from "./pages/OrganizerPanel";
import MyEvent from "./pages/MyEvent";
import "./App.css";
import UpdateEvent from "./pages/UpdatedEvent";

function App() {
  return (
    <Router>
      <AppBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path={"/signup"} element={<Signup />} />
        <Route path={"/login"} element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/updateprofile" element={<UpdateProfile />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/events" element={<EventsList />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/users-list" element={<UsersList />} />
        <Route path="/attendee-panel" element={<AttendeePanel />} />
        <Route path="/organizer-panel" element={<OrganizerPanel />} />
        <Route path="/my-event" element={<MyEvent />} />
        <Route path="/update-event/:id" element={<UpdateEvent />} />
      </Routes>
    </Router>
  );
}

export default App;
