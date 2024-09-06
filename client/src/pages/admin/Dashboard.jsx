import axios from "axios";
import { useEffect, useState } from "react";
import ViewEvents from "../admin/ViewEvents"
import ViewUsers from "../admin/ViewUsers"

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/admin/events");
        setEvents(response.data.events);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  if (loading) return <p>Loading...</p>;
  return (
    <div>
      <div className="flex justify-start px-3 bg-emerald-200">
        Admin Dashboard
      </div>
      <div className="grid grid-cols-4 justify-center gap-5  pt-[20vh]">
        <div />
        <ViewEvents/>
        <ViewUsers/>
        <div />
       
      </div>
    </div>
  );
}
