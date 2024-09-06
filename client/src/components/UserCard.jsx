export default function UserCard(props) {
  return (
    <div>
      {props.users?.length > 0 ? (
        props.users.map((e, i) => {
          return (
            <div key={i} className="flex bg-red-200 space-y-10 p-2 border">
              {e.username}
            </div>
          );
        })
      ) : (
        <p>No User available</p>
      )}
    </div>
  );
}
