const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const http = require('http');
const { Server } = require('socket.io');
const {ApolloServer} = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const server = express();
const { default: mongoose } = require('mongoose');
const {redisClient , redisPublisher ,redisSubscriber} = require('./util/redis');    
const app = http.createServer(server);
const io = new Server(app , {
    cors:{
        origin:'*',
    }
});


server.use(cors({
    // origin:"http://127.0.0.1:5500",
    // methods:["GET","POST","DELETE"]
}));
server.use(bodyParser.json());

  
io.on('connection',(socket) =>{
    console.log('connected:'+socket.id);
    socket.on('join-room' ,async  (roomuuid) =>{
        console.log('joined roomuuid' , roomuuid);
        socket.join(roomuuid);
        await redisSubscriber.subscribe(roomuuid);
    })
    
    socket.on('send-message',async (obj) => {
        console.log(obj);
        const {roomUUID} = obj;
        await  redisPublisher.publish(roomUUID , JSON.stringify(obj))
        // socket.to(roomUUID).emit('receive-message',obj);
    })
   

    socket.on('leave-room', (roomUUID) => {
        console.log('left group ',roomUUID)
        socket.leave(roomUUID);
    })
    
})

redisSubscriber.on('message', (channel, message) => {
    const parsedMessage = JSON.parse(message);
    io.to(channel).emit('receive-message', parsedMessage);
    console.log(parsedMessage);
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
