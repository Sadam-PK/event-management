import { useEffect, useState } from "react";
import axios from "axios";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/admin/users");
        setUsers(response.data.users);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      users list
      <div>
        {users.length > 0 ? (
          users.map((e, i) => {
            return <div key={i}>{e.username}</div>;
          })
        ) : (
          <p>No User available</p>
        )}
      </div>
    </div>
  );
}
