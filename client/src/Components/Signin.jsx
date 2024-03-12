// import * as e from 'express';
import React, { useEffect, useRef, useState } from "react";
import { useLazyQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { useNavigate } from "react-router-dom";
import './Chat/Chat.css';
// import { Context } from "./Context/context";

const CREATE_ROOM = gql`
  mutation SendMessage($roomId: String!) {
    createRoom(roomId: $roomId) {
      roomUUID
    }
  }
`;

const JOIN_ROOM =  gql`
  query JoinRoom($roomId: String!) {
    joinRoom(roomId: $roomId) {
      roomUUID
    }
  }
`

const Signin = () => {
  const usernameRef = useRef(null);
 
  const roomRef = useRef(null);
  const [showCreateButton, setShowCreateButton] = useState(false);
  const navigate = useNavigate();
  
  const [createRoom] = useMutation(CREATE_ROOM);
  const [joinRoom, { loading, error, data: joinRoomData }] = useLazyQuery(JOIN_ROOM);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = usernameRef.current?.value;
    const roomId = roomRef.current?.value;
 

    try {
      if (showCreateButton) {
        const { data } = await createRoom({ variables: { roomId } });
        console.log(data)
        navigate(`/${data.createRoom.roomUUID}`);
      } else {
        joinRoom({ variables: { roomId } });
        // console.log(joinRoomDataa)
      }
      localStorage.setItem('username', username);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() =>{
    if (joinRoomData) {
      // console.log(joinRoomData);
      navigate(`/${joinRoomData.joinRoom.roomUUID}`);
    }
    
  },[joinRoomData ,navigate])
  const showCreateButtonToggler = () => setShowCreateButton(!showCreateButton);

  return (
    <div className="container sigin">
      {error && <p className="error">Room not found</p>}
      <form onSubmit={handleSubmit}>
        <label className="form-label" htmlFor="username">UserName</label>
        <input type="text" className="form-control" id="username" name="username" ref={usernameRef} />
        <label htmlFor="roomId" className="form-label">Room Id:</label>
        <input type="text" id="roomId" className="form-control" name="roomId" ref={roomRef}/>
        <button type="submit" className="btn btn-dark w-100 mt-2">
          {showCreateButton ? 'Create Room' : 'Join Room'}
        </button>
      </form>
      <button onClick={showCreateButtonToggler} className="btn btn-success mt-2">
        {!showCreateButton ? 'Create Room' : 'Join Room'}
      </button>
    </div>
  );
};

export default Signin;
