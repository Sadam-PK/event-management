import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import Profile from "./pages/Profile";
import UpdateProfile from "./pages/UpdateProfile";
import CreateEvent from "./pages/CreateEvent";
import EventsList from "./pages/EventsList";
import EventDetails from "./pages/EventDetails";
import UsersList from "./pages/UsersList";
import AppBar from "./components/AppBar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <Router>
      <AppBar />
      <Routes>
        <Route path={"/signup"} element={<Signup />} />
        <Route path={"/login"} element={<Login />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/updateprofile" element={<UpdateProfile />} />
        <Route path="/createevent" element={<CreateEvent />} />
        <Route path="/eventslist" element={<EventsList />} />
        <Route path="/eventdetails" element={<EventDetails />} />
        <Route path="/userslist" element={<UsersList />} />
      </Routes>
    </Router>
  );
}

export default App;
