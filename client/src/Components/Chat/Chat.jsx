
import { useCallback, useEffect, useState } from "react";
import Footer from "./Footer";
import ChatContainer from "./ChatContainer";
import './Chat.css'
import useSocket from "./useSocket";
import { useParams } from "react-router-dom";
import { useLazyQuery , gql , useMutation } from "@apollo/client";

const GET_MESSAGES = gql`
query GetMessages($roomUUID: String!) {
    getMessages(roomUUID: $roomUUID) {
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
   const {roomUUID} = useParams();
    const socket = useSocket();

    const [getMessages , {data:messageData}] = useLazyQuery(GET_MESSAGES);

    const [sendMessage] = useMutation(SEND_MESSAGE);

    const sendMessageHandler = useCallback(async (message)=>{
        try{
            const {data}  = await sendMessage({variables:{content: message, username, roomUUID}})

            if(data){
                // console.log(data)
                socket.emit('send-message',{...data.sendMessage})
            }

        }
        catch(err){
            console.log(err);
        }
    },[roomUUID , sendMessage, socket,username])
    const displayReceivedMessage = useCallback(((message)=>{
        if(message.roomUUID===roomUUID){
            const updatedMessagesList = [...messages , {...message}];
            // console.log(updatedMessagesList);
            setMessages(updatedMessagesList);
            // console.log(message)
        }
    
    }),[roomUUID, messages])
    useEffect(()=>{
       
        const fetchMessages = async () =>{
           getMessages({variables:{roomUUID}})
           if(messageData) setMessages(messageData.getMessages);
        }
        fetchMessages();
    },[messageData,getMessages , roomUUID])

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
        socket.emit('join-room',roomUUID);
        return ()=>{
            socket.off('join-room', ()=> console.log('joined'));
        }
    },[socket,roomUUID])

    return (
        <div className="container chat conversation w-75">
            <ChatContainer messages={messages} />
            <Footer onSendMessage = {sendMessageHandler}/>
        </div>
    )
}
export default Chat;