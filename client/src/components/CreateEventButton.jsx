export default function CreateEventButton(props) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className="w-20 p-2 border rounded-lg bg-emerald-400"
      placeholder={props.placeholder}
    >
    </button>
  );
}
