import CustomInput from "../components/customInput";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { loginSchema } from "../../../common/zodSchema";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  const handleSubmit = async () => {
    // Validate the form data using Zod
    const validationResult = loginSchema.safeParse({ username, password });

    try {
      const response = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        body: JSON.stringify({
          username: validationResult.data.username,
          password: validationResult.data.password,
        }),
        headers: { "Content-type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.reload();
        navigate("/");
      } else {
        toast.error("Login failed");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div
      className="flex flex-col w-auto h-screen p-3 gap-3 
      justify-center items-center mx-auto m-10"
    >
      <h2 className="font-bold text-xl">Sign In</h2>
      <div className="w-full max-w-xs">
        <CustomInput
          placeholder="Email"
          value={username}
          onChange={handleUsernameChange}
        />
      </div>
      <div className="w-full max-w-xs">
        <CustomInput
          placeholder="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      <button
        className="bg-emerald-400 p-2 border rounded-md w-32"
        onClick={handleSubmit}
      >
        Login
      </button>
      <div className="p-5">
        <p className="text-gray-500">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-700">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
