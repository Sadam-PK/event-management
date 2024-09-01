import CreateNewEvent from "../components/CreateNewEvent";
import ViewMyEvent from "../components/ViewMyEvent";

export default function OrganizerPanel() {
  return (
    <div className="grid grid-cols-4 gap-5 justify-center pt-[20vh]">
      {/* <CreateEvent /> */}
      <div />
      <CreateNewEvent />
      <ViewMyEvent />
      <div />
    </div>
  );
}
