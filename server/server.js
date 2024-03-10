const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const http = require('http');
const { Server } = require('socket.io');
const {ApolloServer} = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const Message = require('./Models/message');
const Room = require('./Models/room');
const server = express();
const { v4: uuidv4 } = require('uuid');


const { default: mongoose } = require('mongoose');


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
    socket.on('join-room' , (roomuuid) =>{
        console.log('joined roomuuid' , roomuuid);
        socket.join(roomuuid);
    })
    socket.on('send-message',(obj) => {
        console.log(obj);
        const {roomUUID} = obj;
        socket.to(roomUUID).emit('receive-message',obj);
    })
    socket.on('leave-room', (roomUUID) => {
        console.log('left group ',roomUUID)
        socket.leave(roomUUID);
    })
    
})

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
