import { useEffect , useRef , useContext } from "react";

const ChatContainer = (props) =>{
    const chatContainerRef = useRef(null);
    const username = localStorage.getItem('username');
    // const ctx = useContext(Context);
  useEffect(() => {

    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [props.messages]);

    return(
        <div className="chat d-flex justify-content-start flex-column " ref={chatContainerRef}>
       
            {props.messages.map((element)=>{
               const user = username===element.username ? 'you' : element.username;
                return (
                    <div key={element.id}><p className={username===element.username ?'self':'other' }
                    >{user}: {element.content}</p></div>
                )
            })}
        </div>
    )
}
export default ChatContainer;