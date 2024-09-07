import axios from "axios";

const loginUser = async (userData) => {
  try {
    const response = await axios.post("http://localhost:3000/user/login", userData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const authService = { loginUser };
export default authService;
