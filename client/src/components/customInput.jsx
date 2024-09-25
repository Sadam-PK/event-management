export default function CustomInput(props) {
  return (
    <div className="border p-3 outline-none rounded-md">
      {props.icon}
      <input
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        className="outline-none"
      />
    </div>
  );
}
