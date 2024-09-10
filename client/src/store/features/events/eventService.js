import axios from "axios";

const fetchEvents = async (
  page,
  query = "",
  sortBy = "createdAt",
  sortOrder = "asc",
  limit = 6
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found in localStorage");
    }
    
    const response = await axios.get("http://localhost:3000/user/events", {
      params: {
        q: query,           
        page: page,         
        limit: limit,       
        sortBy: sortBy,     
        sortOrder: sortOrder, 
      },
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    
    return response.data; 
  } catch (error) {
    console.error("Error fetching events data:", error); 
    throw error; 
  }
};

const eventService = { fetchEvents };
export default eventService;
