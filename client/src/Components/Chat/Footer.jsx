import { useState } from "react";

const Footer = (props) =>{
    const [message,setMessage] = useState('');
    const sendFile = () =>{
        const fileInput = document.getElementById('fileInput'); 
        fileInput.click();
    }
    const sendMessageHandler = (e) =>{
        e.preventDefault();

       if(message.trim().length>0) {
        props.onSendMessage(message);
        setMessage('')
       }
    }
    const sendFileHandler = async (e) =>{
        const selectedFiles = e.target.files[0];
        console.log(selectedFiles);
        try{
            
        }catch(err){
            console.log(err);
        
        }
    }
    return (
        <div className="d-flex">
                <button onClick={sendFile} className="btn btn-secondary ms-1"><i className="bi text-light bi-folder-symlink-fill"></i></button>
                <input type="file" id="fileInput" onChange={sendFileHandler} style={{display:"none"}}/>
                <form className="w-100" onSubmit={sendMessageHandler}>
                    <div className="d-flex">
                        <input type="text" className="form-control" value={message} 
                        onChange={(e) => setMessage(e.target.value)} id="enter-message" placeholder="Send a message"/>
                        
                        <button type="submit" className="btn btn-danger me-1"><i className="bi  bi-arrow-up-right"></i></button>
                    </div>
                </form>
            </div>
    )
}
export default Footer;