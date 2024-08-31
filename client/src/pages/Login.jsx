import CustomInput from "../components/customInput";

export default function Login() {
  return (
    <div
      className="flex flex-col w-auto h-screen p-3 gap-3 
    justify-center items-center mx-auto m-10"
    >
      <h2 className="font-bold text-xl">Sign In</h2>
      <CustomInput placeholder="Email" />
      <CustomInput placeholder="Password" />
      <button className="bg-emerald-400 p-2 border rounded-md
      w-32">Login</button>
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
