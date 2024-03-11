import { useState } from "react";

const Footer = (props) =>{
    const [message,setMessage] = useState('');
    
    const sendMessageHandler = (e) =>{
        e.preventDefault();

       if(message.trim().length>0) {
        props.onSendMessage(message);
        setMessage('');
       }
    }
    
    return (
        <div className="d-flex">
                <form className="w-100" onSubmit={sendMessageHandler}>
                    <div className="d-flex">
                        <input type="text" className="form-control" value={message} 
                        onChange={(e) => setMessage(e.target.value)} id="enter-message" placeholder="Send a message"/>
                        
                        <button type="submit" className="btn btn-danger ms-1"><i className="bi  bi-arrow-up-right"></i></button>
                    </div>
                </form>
            </div>
    )
}
export default Footer;