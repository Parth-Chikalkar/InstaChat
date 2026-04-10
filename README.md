# InstaChat

### A real-time chat application with Instagram-inspired UI & seamless video calling

<br/>

[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=flat-square&logo=socketdotio&logoColor=white)](https://socket.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat-square&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)

<br/>

</div>

---

##  Features

| Feature | Description |
|---|---|
|  **Real-time Messaging** | Instant chat powered by Socket.IO with live updates |
|  **Video Calling** | High-quality video calls via Stream GetStream SDK |
|  **Presence Indicators** | Live online/offline status for all users |
|  **Clear Chat** | One-click chat history cleanup |
|  **Responsive Design** | Fully optimized for mobile and desktop |
|  **Instagram-inspired UI** | Modern, familiar, and visually polished interface |

---

## 🧠 Tech Stack

### Frontend
- **[React](https://reactjs.org/)** (via Vite) — fast, component-based UI
- **[Tailwind CSS](https://tailwindcss.com/)** — utility-first styling
- **[Socket.IO Client](https://socket.io/docs/v4/client-api/)** — real-time event handling

### Backend
- **[Node.js](https://nodejs.org/)** + **[Express.js](https://expressjs.com/)** — REST API server
- **[MongoDB](https://mongodb.com/)** — persistent data storage
- **[Socket.IO](https://socket.io/)** — WebSocket communication layer

### Integrations
- **[Stream Video SDK](https://getstream.io/video/)** — video/audio calling infrastructure
- **[JWT](https://jwt.io/)** — secure authentication tokens

---

## 📂 Project Structure

```
InstaChat/
├── Client/                  # React Frontend (Vite)
│   ├── src/
│   │   ├── Components/      # Reusable UI components
│   │   ├── Pages/           # Route-level pages
│   │   ├── Utils/           # Custom React hooks
│   │           
│   └── .env                 # Frontend environment variables
│
├── Server/                  # Node.js Backend
│   ├── controllers/         # Route handlers
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Express route definitions
│   ├── middleware/          # Auth & error middleware
│   └── .env                 # Backend environment variables
│
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js `v18+`
- MongoDB instance (local or [Atlas](https://www.mongodb.com/atlas))
- [Stream](https://getstream.io/) account for video SDK

---

### 1 · Clone the Repository

```bash
git clone https://github.com/Parth-Chikalkar/InstaChat
cd instachat
```

### 2 · Backend Setup

```bash
cd Server
npm install
npm start
```

### 3 · Frontend Setup

```bash
cd Client
npm install
npm run dev
```

---

## 🔑 Environment Variables

### `Server/.env`

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

GETSTREAM_API_KEY=your_stream_api_key
GETSTREAM_API_SECRET=your_stream_api_secret
```

### `Client/.env`

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_STREAM_API_KEY=your_stream_api_key
```

---

## 📞 Video Calling Flow

```
User A ──► sends call request
             │
             ▼
          User B receives popup
             │
             ▼
          User B accepts
             │
             ▼
    Both users join call room
             │
             ▼
    Stream handles video & audio
```

---

##  Highlights

-**Blazing fast** — Vite + Tailwind keep the frontend lean and snappy
-**Real-time first** — Socket.IO ensures zero-latency messaging
-**Production-grade video** — Stream SDK handles all WebRTC complexity
-**Clean architecture** — frontend and backend are fully decoupled

---

## 📸 UI Inspiration

- **Instagram DM** — familiar, fluid chat interface
- **WhatsApp** — intuitive calling experience

---

## 👨‍💻 Author

**Parth Chikalkar**

<br/>
