
import Chat from "./Chat";
import './Chat.css';
import { useParams } from "react-router-dom";

const Room = (props)=>{
    const params = useParams();
    
    return (
        <>
            <div className="container d-flex justify-content-center flex-column">
              
                <h1 class="text-center">Welcome to chat room</h1>
                <hr/>
               <Chat/>
            </div>
        </>
    )
}
export default Room;