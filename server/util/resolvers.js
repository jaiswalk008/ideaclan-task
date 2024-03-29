const Message = require('../Models/message');
const Room = require('../Models/room');
const { v4: uuidv4 } = require('uuid');
const {redisClient} = require('./redis');

const consumeMessages = require('./consumer');
const setupChannel = require('./publisher');


const resolvers = {
  Query: {
    getMessages: async (_, { roomUUID }) => {
      try {
        const messageCache = await redisClient.hget(roomUUID,'messages');
        if(messageCache){
          const parsedMessage = JSON.parse(messageCache);
          // console.log(parsedMessage);
          return parsedMessage;
        }
       else{
        const messages = await Message.find({ roomUUID });
        //console.log(messages);
        await redisClient.hset(roomUUID , 'messages',JSON.stringify(messages))
        return messages;
       }
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    joinRoom: async (_, { roomId }) => {
      //console.log(roomId);
      try {
        const room = await Room.findOne({ roomId });
        // console.log(room);
        if (room) {
          return { roomUUID: room.roomUUID };
        } else {
          throw new Error("Room not found");
        }
      } catch (error) {
        console.error(error);
        return { error: error.message || "An error occurred" };

      }
    },
  },
  Mutation: {
    sendMessage: async (_, { content, username, roomUUID }) => {
      try {
        const newMessage = new Message({
          content,
          username,
          roomUUID,
        });
        const {channel , queue} = await setupChannel();
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(newMessage)), { persistent: true });
        
        consumeMessages(channel, roomUUID);
     

        return newMessage;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    createRoom: async (_, { roomId }) => {
      try {
        const uuid = uuidv4();
        await Room.create({ roomId, roomUUID: uuid });
        return { roomUUID: uuid };
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
};



module.exports = resolvers;
