export default function CustomRadio() {
  return (
    <div className="flex gap-5">
      <div className="flex gap-2 text-gray-500">
        <label htmlFor="admin">organizer</label>
        <input
          type="radio"
          id="admin"
          name="role"
          value="organizer"
          //   onChange={onChange}
        />
      </div>
      <div className="flex gap-2 text-gray-500">
        <label htmlFor="user">Attendee</label>
        <input
          type="radio"
          id="user"
          name="role"
          value="attendee"
          //   onChange={onChange}
        />
      </div>
    </div>
  );
}
