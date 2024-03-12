
import Chat from "./Chat";
import './Chat.css';


const Room = (props)=>{
   
    
    return (
        <>
            <div className="container d-flex justify-content-center flex-column">
              
                <h1 className="text-center">Welcome to chat room</h1>
                <hr/>
               <Chat/>
            </div>
        </>
    )
}
export default Room;