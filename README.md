
# Ideaclan task

This is a group chat app where a user can sign in with a username and roomId.The application utilizes a GraphQL-based server for efficient querying, Redis for caching messages and pub-sub architecture,
and RabbitMQ for creating a message queue dedicated to storing messages in the database.
## Installation

Follow these steps to set up the Expense Tracker locally:

1. Clone the repository:
```bash
git clone https://github.com/jaiswalk008/complete-expense-tracker.git
```
2. Change into the project directory:
```bash
cd ideaclan-task
```
3. Install the required dependencies:
```bash
cd client
npm install
npm start
start a new terminal
cd server
npm install
npm start
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file
In server: 

client-side: 

`REACT_APP_GRAPHQL_URI`

`REACT_APP_URL`

server-side:

`MONGO_URI`

`PORT`

`REDIS_HOST`

`REDIS_PORT`

`REDIS_USERNAME`

`REDIS_PASSWORD`

**Note**: Created Redis server on aiven.io

## Tech Stack

**Client:** React ,bootstrap

**Server:** Node, Express, Redis, Graphql , Rabbitmq


**Database:** NoSQL, Mongoose
