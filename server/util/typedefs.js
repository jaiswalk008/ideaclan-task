

const typeDefs = `
    type Message {
        _id: String!
        content: String!
        username: String!
        roomUUID: String
    }

    type Room {
        id: ID!
        roomUUID: String!
    }

    type Query {
        getMessages(roomUUID: String!): [Message]
        joinRoom(roomId:String!) : Room
    }
    type Mutation {
        sendMessage(content: String!, username: String!, roomUUID: String): Message
        createRoom(roomId: String!): Room
    }
      
`;

module.exports = typeDefs;
