
import { useCallback, useEffect, useState } from "react";
import Footer from "./Footer";
import ChatContainer from "./ChatContainer";
import './Chat.css'
import useSocket from "./useSocket";
import { useParams } from "react-router-dom";
import { useLazyQuery , gql , useMutation } from "@apollo/client";

const GET_MESSAGES = gql`
query GetMessages($roomUuid: String!) {
    getMessages(roomUUID: $roomUuid) {
      _id
      content
      username
    }
  }
`
const SEND_MESSAGE = gql`
mutation SendMessage($content: String!, $username: String!, $roomUUID: String) {
    sendMessage(content: $content, username: $username, roomUUID: $roomUUID) {
      _id
      content
      username
      roomUUID
    }
  }  
`;
const Chat = () => {
   const username = localStorage.getItem('username') || 'unknown';
    const [messages , setMessages] = useState([]);
   const {roomuuid} = useParams();
    const socket = useSocket();
    const [getMessages , {loading1 , error1 , data:Messages}] = useLazyQuery(GET_MESSAGES);
    // const [sendMessage, { loading2, error2, data: Message }] = useMutation();
    const [sendMessage] = useMutation(SEND_MESSAGE);
    const sendMessageHandler = useCallback(async (message)=>{
        const messageDetails = {message,roomuuid,username}
        // console.log(messageDetails);
        try{
            const {data}  = await sendMessage({variables:{content: message, username, roomUUID: roomuuid}})

            if(data){
                console.log(data)
                socket.emit('send-message',{...data.sendMessage})
            }

        }
        catch(err){
            console.log(err);
        }
    },[messages])

    const displayReceivedMessage = useCallback(((message)=>{
        if(message.roomUUID===roomuuid){
            const updatedMessagesList = [...messages , {...message}];
            // console.log(updatedMessagesList);
            setMessages(updatedMessagesList);
            // console.log(message)
        }
    
    }),[roomuuid, messages])
    useEffect(()=>{
        if(!username){
            window.alert()
        }
        const fetchMessages = async () =>{
           getMessages({variables:{roomUuid: roomuuid}})
           if(Messages) setMessages(Messages.getMessages);
        }
        fetchMessages();
    },[Messages])

    useEffect(() =>{
        socket.on('connect',() =>{
            console.log(socket.id);
        })
        socket.on('receive-message',displayReceivedMessage)
        return () =>{
            socket.off('connect',()=> console.log('connected'))
            
            socket.off('receive-message', displayReceivedMessage)
        }
    },[socket,messages,displayReceivedMessage])

    useEffect(() =>{
        socket.emit('join-room',roomuuid);
        return ()=>{
            socket.off('join-room', ()=> console.log('joined'));
        }
    },[socket])

    return (
        <div className="container chat conversation w-75">
            <ChatContainer messages={messages} />
            <Footer onSendMessage = {sendMessageHandler}/>
        </div>
    )
}
export default Chat;