
const Message = require('../Models/message');
const {redisClient} = require('./redis');
const consumeMessages = async (channel ,roomUUID) => {
  try {
   
    const queue = 'messages_queue';
    
    channel.consume(queue, async (message) => {
      const newMessage = JSON.parse(message.content.toString());

      const messages =await redisClient.hget(roomUUID, 'messages');
        if(messages){
          const parsedMessages = JSON.parse(messages);
          parsedMessages.push(newMessage);
          await redisClient.hset(roomUUID, 'messages', JSON.stringify(parsedMessages));

        }
      await Message.create(newMessage);

      // Acknowledge the message so that the broker removes the message from the queue
      channel.ack(message);
       
    });

  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = consumeMessages;