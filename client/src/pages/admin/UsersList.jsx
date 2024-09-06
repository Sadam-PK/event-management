import { useEffect, useState } from "react";
import UserCard from "../../components/UserCard"
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
      <div><h2 className="mb-10 px-3 bg-emerald-200">Users List</h2></div>
      <UserCard users={users}/>
    </div>
  );
}

