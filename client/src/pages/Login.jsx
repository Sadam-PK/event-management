import CustomInput from "../components/customInput";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  return (
    <div
      className="flex flex-col w-auto h-screen p-3 gap-3 
    justify-center items-center mx-auto m-10"
    >
      <h2 className="font-bold text-xl">Sign In</h2>
      <CustomInput
        placeholder="Email"
        value={username}
        onChange={handleUsernameChange}
      />
      <CustomInput
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
      />
      <button
        className="bg-emerald-400 p-2 border rounded-md
      w-32"
        onClick={async () => {
          fetch("http://localhost:3000/user/login", {
            method: "POST",
            body: JSON.stringify({
              username: username,
              password: password,
            }),
            headers: {
              "Content-type": "application/json",
            },
          })
            .then((res) => {
              return res.json();
            })
            .then((data) => {
              localStorage.setItem("token", data.token);
              window.location.reload();
              navigate("/");
            });
        }}
      >
        Login
      </button>
      <div className="p-5">
        <p className="text-gray-500">
          Don't have an account?{" "}
          {/* <Link to="/signup">Signup</Link> */}
          <a href="/signup" className="text-blue-700">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
