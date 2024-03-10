
import Chat from "./Chat";
import './Chat.css';
import { useParams } from "react-router-dom";

const Room = (props)=>{
    const params = useParams();
    console.log(params)
    return (
        <>
            <div className="container d-flex justify-content-center flex-column">
              
                <h1>{params.roomuuid}</h1>
               <Chat/>
            </div>
        </>
    )
}
export default Room;