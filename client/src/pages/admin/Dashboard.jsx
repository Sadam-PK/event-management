import axios from "axios";
import { useEffect, useState } from "react";

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
      <div>
        {events.length > 0 ? (
          events.map((e, i) => {
            return <div key={i}>{e.title}</div>;
          })
        ) : (
          <p>No events available</p>
        )}
      </div>
    </div>
  );
}
