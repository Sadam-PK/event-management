import { useLocation } from "react-router-dom";

export default function ViewAttendees() {
  const location = useLocation();
  const event = location.state?.event;

  return (
    <div>
      <div className="bg-emerald-200 px-3">Attendees List</div>
      <div className="p-3">
        {event?.attendees.map((e, i) => {
          return (
            <div key={i} className="border-b py-2">
              {i + 1 + ". "}
              {e.username}
            </div>
          );
        })}
      </div>
    </div>
  );
}
