import CustomInput from "../components/customInput";
import CustomRadio from "../components/customRadio";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { signUpSchema } from "../../../common/zodSchema";

export default function Signup() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  const handleNameChange = (event) => setName(event.target.value);
  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);
  const handleRadioChange = (event) => setRole(event.target.value);

  const handleSubmit = async () => {
    const validateResponse = signUpSchema.safeParse({
      username,
      password,
      role,
    });
  
    if (!validateResponse.success) {
      // Log validation errors
      toast.error("Validation failed: " + validateResponse.error.message);
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3000/user/signup", {
        method: "POST",
        body: JSON.stringify({
          name: name,
          username: validateResponse.data.username,
          password: validateResponse.data.password,
          role: validateResponse.data.role,
        }),
        headers: {
          "Content-type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Signup failed: " + response.statusText);
      }
  
      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        toast.error("Signup failed: No token received");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error("An error occurred: " + error.message);
    }
  };
  

  return (
    <div
      className="flex flex-col w-auto h-screen p-3 gap-3 
      justify-center items-center mx-auto m-10"
    >
      <h2 className="font-bold text-xl">Sign Up Here!</h2>
      <CustomRadio onChange={handleRadioChange} />
      <CustomInput
        placeholder="Name"
        value={name}
        onChange={handleNameChange}
      />
      <CustomInput
        placeholder="Email"
        value={username}
        onChange={handleUsernameChange}
      />
      <CustomInput
        placeholder="Password"
        type="password"
        value={password}
        onChange={handlePasswordChange}
      />
      <button
        className="bg-emerald-400 p-2 border rounded-md
        w-32"
        onClick={handleSubmit}
      >
        Register
      </button>
      <div className="p-5">
        <p className="text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-blue-700">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
