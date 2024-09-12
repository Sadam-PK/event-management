import CreateNewEvent from "../components/CreateNewEvent";
import ViewMyEvent from "../components/ViewMyEvent";

export default function OrganizerPanel() {
  return (
    <div>
      <div className="bg-emerald-200 px-3">Organizer Panel</div>
      <div className="grid grid-cols-4 mx-auto gap-5 items-center justify-center pt-[20vh]">
        <div />
        <CreateNewEvent />
        <ViewMyEvent />
        <div />
      </div>
    </div>
  );
}
