export default function AppBar() {
  return (
    <div className="bg-emerald-300 p-3 flex justify-between">
      <h2 className="font-bold">
        <a href="/">Event Management</a>
      </h2>
      <ul className="flex flex-row gap-5">
        <li>user</li>
        <li>logout</li>
      </ul>
    </div>
  );
}
