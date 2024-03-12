const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const http = require('http');
const { Server } = require('socket.io');
const {ApolloServer} = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { fork } = require('child_process');
const { default: mongoose } = require('mongoose');
const { redisPublisher ,redisSubscriber} = require('./util/redis');    

const server = express();

const app = http.createServer(server);
const io = new Server(app , {
    cors:{
        origin:'http://localhost:3000',
    }
});

// fork a new process for consumer.js to run it on a separate thread
fork('./util/consumer');

server.use(cors({
    origin:'http://localhost:3000',
    
}));
server.use(bodyParser.json());

  
io.on('connection',(socket) =>{
    //console.log('connected:'+socket.id);
    socket.on('join-room' ,async  (roomuuid) =>{
        // console.log('joined roomuuid' , roomuuid);
        socket.join(roomuuid);
        await redisSubscriber.subscribe(roomuuid);
    })
    
    socket.on('send-message',async (messageObj) => {
        // console.log(messageObj);
        const {roomUUID} = messageObj;
        //publishing message
        await  redisPublisher.publish(roomUUID , JSON.stringify(messageObj))
    })

})
//consuming messages
redisSubscriber.on('message', (channel, message) => {
    const parsedMessage = JSON.parse(message);
    io.to(channel).emit('receive-message', parsedMessage);
    //console.log(parsedMessage);
});
  
async function startServer(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
        const apolloServer = new ApolloServer({
            typeDefs:require('./util/typedefs'),
            resolvers: require('./util/resolvers'),
        });
        await apolloServer.start();
        server.use('/graphql',expressMiddleware(apolloServer));

        app.listen(process.env.PORT || 5000 , () => console.log('server is runnning '));
    }catch(err){console.log(err);}
}

startServer();
