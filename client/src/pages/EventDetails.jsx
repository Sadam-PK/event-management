import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"

export default function EventDetails(){
    const {id} = useParams();
    const [event, setEvent] = useState(null);
    
    useEffect(() => {
        const fetchEvent = async () => {
          try {
            const response = await axios.get(`http://localhost:3000/user/events/${id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            setEvent(response.data);
          } catch (error) {
            console.error("Error fetching event details:", error);
          }
        };
    
        fetchEvent();
      }, []); 

    return(
        <div>
           event details...
           {event?.title}
        </div>
    )
}