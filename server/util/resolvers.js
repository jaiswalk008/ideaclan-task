const Message = require('../Models/message');
const Room = require('../Models/room');
const { v4: uuidv4 } = require('uuid');

const resolvers = {
  Query: {
    getMessages: async (_, { roomUUID }) => {
      try {
        const messages = await Message.find({ roomUUID });
        return messages;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    joinRoom: async (_, { roomId }) => {
      console.log(roomId);
      try {
        const room = await Room.findOne({ roomId });
        console.log(room);
        if (room) {
          return { roomUUID: room.roomUUID };
        } else {
          throw new Error("Room not found");
        }
      } catch (error) {
        console.error(error);
        throw error;
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

        // Save the new message to the database
        const savedMessage = await newMessage.save();

        return savedMessage;
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
