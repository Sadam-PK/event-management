import CustomInput from "../components/customInput";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
// import { loginSchema } from "../../../common/zodSchema.js";
import { loginSchema } from "@sadamccr/eventcommon";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../store/features/auth/authSlice";
import { userMe } from "../store/features/user/userSlice";
import { Audio } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faPerson, faUser } from "@fortawesome/free-solid-svg-icons";
import CustomButton from "../components/customButton.jsx";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { status } = useSelector((state) => state.auth);

  const navigate = useNavigate();

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
        dispatch(userMe());
        navigate("/");
      } else {
        toast.error("Token is null");
      }
    } catch (error) {
      toast.error("Login failed");
    }
  };

  useEffect(() => {
    if (auth.user) {
      navigate("/");
    }
  }, [auth.user, navigate]);

  useEffect(() => {
    // Listen for token changes in localStorage, i.e., after logout
    const handleStorageChange = () => {
      if (!localStorage.getItem("token")) {
        dispatch(logout());
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [dispatch]);

  return (
    <div
      className="flex flex-col w-auto h-screen p-3 gap-3 
    justify-center items-center mx-auto"
    >
      <FontAwesomeIcon icon={faUser} size="4x" color="gray"/>
      <h2 className="font-bold text-xl text-gray-600 py-3">Sign In</h2>
      <div className="w-full max-w-xs">
        <CustomInput
          icon={
            <FontAwesomeIcon icon={faUser} className="text-gray-700 mr-3" />
          }
          placeholder="Email"
          value={username}
          onChange={handleUsernameChange}
        />
      </div>
      <div className="w-full max-w-xs">
        <CustomInput
          icon={
            <FontAwesomeIcon icon={faLock} className="text-gray-700 mr-3" />
          }
          placeholder="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>

      <CustomButton
        name="Login"
        onClick={handleSubmit}
        className="bg-emerald-400 p-2 border-2 border-emerald-400 rounded-md w-32
        hover:bg-transparent hover:border-emerald-400 hover:border-2
        hover:text-emerald-600"
      />

      <div className="p-5">
        <p className="text-gray-500">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-700 hover:text-blue-500 
          transition duration-300">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
