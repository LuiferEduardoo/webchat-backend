# Chat Application with Express.js, React.js, Socket.io, and MongoDB

This project is a real-time chat application that supports both private messages and group chats using Socket.io. The backend is built with Express.js and MongoDB. Authentication is handled via OAuth (Google), email, and password.

## Features
- **User authentication**
- **Real-time private messaging**
- **Real-time group messaging (Rooms)**
- **Message storage in MongoDB**
- **User joins and leaves chat rooms dynamically**

## Technologies Used
### Backend
- Node.js
- Express.js
- MongoDB (Mongoose ODM)
- Socket.io
- Docker

## Installation
### 1. Clone the Repository
```sh
git clone https://github.com/LuiferEduardoo/webchat-backend
```

### 2. Install Dependencies
#### Backend
```sh
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the backend folder and set the following variables:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/chatdb
```

### 4. Start the database in development
```sh
  docker-compose -f docker-compose.dev.yml up -d
```

### 5. Start the Server in development
```sh
  npm run dev
```

## API Endpoints
### User Authentication (To Be Implemented)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with credentials

### Messages
- `GET /api/messages/:userId` - Get all messages for a user
- `POST /api/messages/private` - Send a private message
- `POST /api/messages/group` - Send a message to a group

## WebSocket Events
### Client-side Events
- `joinRoom({ groupId })` - Join a chat room
- `sendMessage({ senderId, receiverId, message })` - Send a private message
- `sendGroupMessage({ senderId, groupId, message })` - Send a message to a group
- `getMessages({ userId, groupId })` - Retrieve messages

### Server-side Events
- `newMessage` - Broadcasts private messages
- `newGroupMessage` - Broadcasts group messages

## License
This project is open-source and available under the MIT License.