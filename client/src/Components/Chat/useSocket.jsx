import { io } from "socket.io-client";
import { useMemo } from "react";

const useSocket = () =>{
    const socket = useMemo(()=> io(process.env.REACT_APP_URL),[]);
    return socket;
}

export default useSocket;
