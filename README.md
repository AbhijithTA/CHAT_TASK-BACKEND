
## 💬 Chat App – Backend

This is the backend server for a real-time chat application built using **Node.js**, **Express**, **MongoDB**, and **Socket.IO**.

---

### 🚀 Features

* User registration & login with **JWT** authentication
* Real-time messaging using **Socket.IO**
* Tracks **online/offline** user status
* Supports **one-to-one chat** via dynamic conversations
* MongoDB models: User, Message, Conversation

---

### 📦 Tech Stack

* **Node.js + Express**
* **MongoDB + Mongoose**
* **Socket.IO**
* **JWT Auth**
* **dotenv**

---

### ⚙️ Setup Instructions

1. **Clone the repository**

```bash
https://github.com/AbhijithTA/CHAT_TASK-BACKEND
cd chat-backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Create a `.env` file**

```env
PORT=7777
MONGO_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your_jwt_secret_key
```

4. **Start the server**

```bash
npm run dev
```

Server will run at: `http://localhost:7777`

---

### 🧠 API Routes

#### 👤 Auth

* `POST /api/auth/register` – Register a new user
* `POST /api/auth/login` – Login and get JWT token

#### 🧑‍🤝‍🧑 Users

* `GET /api/users` – Get all users (excluding current)

#### 💬 Conversations

* `GET /api/conversations` – Get all user conversations
* `POST /api/conversations` – Create or fetch conversation

#### 📨 Messages

* `GET /api/messages/:conversationId` – Get messages
* `POST /api/messages` – Send a message

---

### 🔌 Socket.IO Events

* `userOnline`, `userOffline` – User presence tracking
* `join_conversation`, `send_message`, `receive_message` – Real-time chat



