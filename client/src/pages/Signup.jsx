import CustomInput from "../components/customInput";
import CustomRadio from "../components/customRadio";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { signUpSchema } from "../../../common/zodSchema";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userRegister } from "../store/features/register/registerSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";

export default function Signup() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.register);

  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error("Signup failed: " + error.message);
    }
  }, [error]);

  const handleNameChange = (event) => setName(event.target.value);
  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);
  const handleRadioChange = (event) => setRole(event.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validateResponse = signUpSchema.safeParse({
      username,
      password,
      role,
    });

    if (!validateResponse.success) {
      toast.error("Validation failed: " + validateResponse.error.message);
      return;
    }

    try {
      await dispatch(userRegister({ username, password, role })).unwrap();
      navigate("/");
    } catch (error) {
      toast.error("Signup failed: " + error.message);
    }
  };

  return (
    <div
      className="flex flex-col w-auto h-screen p-3 gap-3 
      justify-center items-center mx-auto"
    >
      <h2 className="font-bold text-xl">Sign Up Here!</h2>
      <CustomRadio onChange={handleRadioChange} value={role} />
      <CustomInput
        icon={<FontAwesomeIcon icon={faUser} className="text-gray-700 mr-3" />}
        placeholder="Name"
        value={name}
        onChange={handleNameChange}
      />
      <CustomInput
        icon={<FontAwesomeIcon icon={faUser} className="text-gray-700 mr-3" />}
        placeholder="Email"
        value={username}
        onChange={handleUsernameChange}
      />
      <CustomInput
        icon={<FontAwesomeIcon icon={faLock} className="text-gray-700 mr-3" />}
        placeholder="Password"
        type="password"
        value={password}
        onChange={handlePasswordChange}
      />
      <button
        className="bg-emerald-400 p-2 border-2 border-emerald-400 rounded-md w-32
        hover:bg-transparent hover:border-emerald-400 hover:border-2
        hover:text-emerald-600"
        onClick={handleSubmit}
      >
        Register
      </button>
      <div className="p-5">
        <p className="text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-700">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
