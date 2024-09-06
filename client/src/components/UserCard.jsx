export default function UserCard(props) {
  return (
    <div>
      {props.users?.length > 0 ? (
        props.users.map((e, i) => {
          return (
            <div key={i} className="flex p-3 mt-1 justify-between border-t px-10">
              {i + 1 + "."} {"  "} {e.username}
              <button
                className="border w-20 h-10 rounded-md bg-emerald-400
               hover:bg-red-400 hover:text-white"
              >
                Delete
              </button>
            </div>
          );
        })
      ) : (
        <p>No User available</p>
      )}
    </div>
  );
}
