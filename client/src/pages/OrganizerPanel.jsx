import CreateEventCard from "../components/CreateEventCard";
import ViewMyEventCard from "../components/ViewMyEventCard";

export default function OrganizerPanel() {
  return (
    <div>
      <div className="bg-emerald-200 px-3 text-sm">Organizer Panel</div>
      <div className="grid grid-cols-4 mx-auto gap-5 items-center justify-center pt-[20vh]">
        <div />
        <CreateEventCard />
        <ViewMyEventCard />
        <div />
      </div>
    </div>
  );
}
