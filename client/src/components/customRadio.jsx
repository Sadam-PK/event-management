export default function CustomRadio(props) {
  return (
    <div className="flex gap-5">
      <div className="flex gap-2 text-gray-500">
        <label htmlFor="organizer">Organizer</label>
        <input
          type="radio"
          id="organizer"
          name="role"
          value="organizer"
          onChange={props.onChange}
        />
      </div>
      <div className="flex gap-2 text-gray-500">
        <label htmlFor="attendee">Attendee</label>
        <input
          type="radio"
          id="attendee"
          name="role"
          value="attendee"
          onChange={props.onChange}
        />
      </div>
    </div>
  );
}
