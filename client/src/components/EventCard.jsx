export default function EventCard(props) {
  return (
    <div
      className="border w-[30vw] h-[30vh] p-3  hover:border-gray-500
    cursor-pointer justify-between flex flex-col items-center"
      onClick={props.onClick}
    >
      {props.event.title}
    </div>
  );
}
