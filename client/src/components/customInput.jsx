export default function CustomInput(props) {
  return (
    <input
      type="text"
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
    />
  );
}
