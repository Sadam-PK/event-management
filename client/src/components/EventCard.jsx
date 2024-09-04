
// ---- card mapping through list of event
export default function EventCard(props) {
  return (
    <div
      className="border w-[30vw] h-[30vh] p-3  hover:border-gray-500
    cursor-pointer justify-center flex flex-col items-center overflow-hidden
    object-cover font-bold text-gray-500 rounded-xl"
      onClick={props.onClick}
    >
      {props.event.title}
      {/* <img src={props.event.imgPath} alt=""  className="p-2 border"/> */}
    </div>
  );
}
