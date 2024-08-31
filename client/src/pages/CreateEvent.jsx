import CreateEventButton from "../components/CreateEventButton";
import CustomInput from "../components/customInput";

export default function CreateEvent() {
  return (
    <div className="flex flex-col items-center h-screen justify-center">
      <h2 className="font-bold mb-10 text-xl">Create Event</h2>
      <div className="flex flex-col w-[30vw] gap-3 items-center">
        <CustomInput placeholder="Title" />
        <CustomInput placeholder="Description" />
        {/* <CustomButton placeholder="Create" /> */}
        <CreateEventButton/>
      </div>
    </div>
  );
}
