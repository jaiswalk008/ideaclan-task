const { connect } = require('amqplib');

let connection=null;

const setupChannel = async () => {
  try {
    if(!connection){
        connection = await connect('amqp://localhost');

    }
    const channel = await connection.createChannel();
    
    const queue = 'messages_queue';
    await channel.assertQueue(queue, { durable: true });

    return { channel, queue };
  } catch (error) {
    console.error(error);
    throw error;
  }
};


module.exports =  setupChannel
