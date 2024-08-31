export default function EventCard(props) {
  return (
    <div
      className="border w-[30vw] h-[30vh] p-3  hover:border-gray-500
    cursor-pointer "
      onClick={props.onClick}
    >
      {props.event.title}
    </div>
  );
}
