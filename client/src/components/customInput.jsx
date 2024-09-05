export default function CustomInput(props) {
  return (
    <input
      type={props.type}
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}

      className="border p-3"
    />
  );
}
