import CustomInput from "../components/customInput";
import CustomButton from "../components/customButton";
import CustomRadio from "../components/customRadio";

export default function Signup() {
  return (
    <div
      className="flex flex-col w-auto h-screen p-3 gap-3 
    justify-center items-center mx-auto m-10"
    >
      <h2 className="font-bold text-xl">Sign Up Here!</h2>
      <CustomRadio/>
      <CustomInput placeholder="Name" />
      <CustomInput placeholder="Email" />
      <CustomInput placeholder="Password" />
      <button className="bg-emerald-400 p-2 border rounded-md
      w-32">Register</button>
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
