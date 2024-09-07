import CustomInput from "../components/customInput";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { loginSchema } from "../../../common/zodSchema.js";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/features/auth/authSlice";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Use useSelector to get auth state
  const auth = useSelector((state) => state.auth);
  
  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  const handleSubmit = async () => {
    const validationResult = loginSchema.safeParse({ username, password });
    if (!validationResult.success) {
      toast.error("Invalid input");
      return;
    }

    try {
      const response = await dispatch(login(validationResult.data)).unwrap();
      if (response.token) {
        localStorage.setItem("token", response.token);
        navigate("/");
      } else {
        console.log("Token is null");
      }
    } catch (error) {
      toast.error("Login failed");
    }
  };

  // Redirect user if already logged in
  useEffect(() => {
    if (auth.user) {
      navigate("/");
    }
  }, [auth.user, navigate]);

  return (
    <div className="flex flex-col w-auto h-screen p-3 gap-3 justify-center items-center mx-auto m-10">
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
      {auth.status === "loading" && <p>Loading...</p>}
      {auth.error && <p className="text-red-500">{auth.error}</p>}
    </div>
  );
}
