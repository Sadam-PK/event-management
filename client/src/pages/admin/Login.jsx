import CustomInput from "../components/customInput";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  const handleLogin = async () => {
    
    try {
      const response = await fetch("http://localhost:3000/admin/login", {
        method: "POST",
        body: JSON.stringify({
          email, // Now sending the correct email field
          password,
        }),
        headers: {
          "Content-type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error("Something went wrong, please try again later.");
    }
  };

  return (
    <div className="flex flex-col w-auto h-screen p-3 gap-3 justify-center items-center mx-auto m-10">
      <h2 className="font-bold text-xl">Sign In</h2>
      <CustomInput
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
      />
      <CustomInput
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
        type="password"
      />
      <button
        className="bg-emerald-400 p-2 border rounded-md w-32"
        onClick={handleLogin}
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
