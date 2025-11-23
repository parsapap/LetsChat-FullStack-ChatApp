# 💬 LetsChat - Real-Time Chat Application

A modern full-stack chat application with real-time messaging, built using the MERN stack and Socket.io.

## 🚀 Features

### Core Features
- **Real-Time Messaging** - Instant message delivery using WebSocket (Socket.io)
- **User Authentication** - Secure JWT-based authentication with bcrypt password hashing
- **Online Status** - See which users are online/offline in real-time
- **Typing Indicators** - Visual feedback when someone is typing
- **Message Management**
  - **Edit Messages** - Edit sent messages within 24 hours (shows "edited" label)
  - **Delete Messages** - Permanently delete messages with confirmation
- **Image Sharing** - Send images in conversations (Cloudinary or base64)
- **Profile Management** - Upload and update profile pictures
- **Theme Customization** - 32 beautiful themes to choose from
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### Technical Features
- JWT token-based authentication with HTTP-only cookies
- Real-time WebSocket communication
- MongoDB for data persistence
- RESTful API architecture
- Docker containerization ready

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Zustand** - Lightweight state management
- **Socket.io Client** - Real-time communication
- **TailwindCSS** - Utility-first CSS framework
- **DaisyUI** - Component library
- **Vite** - Fast build tool
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - WebSocket server
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Cloudinary** - Image hosting (optional)

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Web server

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (v6+)
- Docker (optional)

### Quick Start with Docker

1. **Clone the repository**
```bash
git clone https://github.com/parsapap/LetsChat-FullStack-ChatApp.git
cd LetsChat-FullStack-ChatApp
```

2. **Create `.env` file in root directory**
```env
MONGODB_URI=mongodb://root:admin@mongo:27017/chatApp?authSource=admin
JWT_SECRET=your_secret_key_here
PORT=5001
NODE_ENV=production
```

3. **Run with Docker**
```bash
docker compose up -d --build
```

4. **Access the application**
- Frontend: http://localhost:8080
- Backend: http://localhost:5001

### Local Development

1. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

2. **Start MongoDB**
```bash
mongod
```

3. **Start backend server**
```bash
cd backend
npm run dev
```

4. **Start frontend server**
```bash
cd frontend
npm run dev
```

Frontend runs on http://localhost:5173

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/check` - Check authentication status
- `PUT /api/auth/update-profile` - Update profile picture

### Messages
- `GET /api/messages/users` - Get all users
- `GET /api/messages/:id` - Get messages with a user
- `POST /api/messages/send/:id` - Send message
- `PUT /api/messages/edit/:id` - Edit message (24h limit)
- `DELETE /api/messages/delete/:id` - Delete message

### WebSocket Events
- `newMessage` - New message received
- `messageEdited` - Message was edited
- `messageDeleted` - Message was deleted
- `typing` / `stopTyping` - Typing indicators
- `getOnlineUsers` - List of online users

## 📁 Project Structure

```
LetsChat-FullStack-ChatApp/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   ├── models/           # MongoDB models
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Auth middleware
│   │   ├── lib/              # Socket.io, DB, Utils
│   │   └── index.js          # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── store/            # Zustand stores
│   │   ├── lib/              # Axios, Utils
│   │   └── App.jsx
│   └── package.json
│
├── k8s/                      # Kubernetes manifests
├── docker-compose.yml
└── README.md
```

## 🎯 Key Features in Detail

### Real-Time Messaging
Messages are delivered instantly using Socket.io WebSocket connection with sub-100ms latency.

### Message Editing
Users can edit their own messages within 24 hours. Edited messages display an "(edited)" label and updates are reflected in real-time for all users.

### Message Deletion
Users can delete their own messages permanently. A confirmation dialog prevents accidental deletions, and the deletion is synced in real-time.

### Typing Indicators
When a user types, other participants see a "typing..." indicator that automatically disappears after 3 seconds of inactivity or when the message is sent.

### Online Status
Real-time tracking of user online/offline status with visual indicators (green dot for online).

## 🐳 Docker Commands

```bash
# Production mode (port 8080)
docker compose up -d --build

# Development mode (port 5173 with hot reload)
docker compose -f docker-compose.dev.yml up -d --build

# View logs
docker compose logs -f

# Stop containers
docker compose down

# Remove volumes
docker compose down -v
```

## 🔒 Security Features

- JWT token-based authentication
- HTTP-only cookies for token storage
- bcrypt password hashing with salt
- Protected API routes
- CORS configuration
- Input validation

## 📱 Responsive Design

Fully responsive UI that works on:
- Desktop (1920px and above)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎨 Themes

Choose from 32 beautiful DaisyUI themes including:
- Light, Dark, Cupcake, Bumblebee, Emerald
- Synthwave, Cyberpunk, Valentine, Halloween
- Forest, Aqua, Dracula, Night, Coffee
- And many more...

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

---

## 📸 Screenshots

### Login Page
![Login Page](frontend/public/login.png)
*Secure authentication with email and password*

---

### Chat Interface
![Chat Interface](frontend/public/chat.png)
*Real-time messaging with typing indicators, message editing, and online status*

---

### Settings Page
![Settings Page](frontend/public/settings.png)
*Customize your experience with 32 beautiful themes*

---

### Profile Page
![Profile Page](frontend/public/acess.png)
*Manage your profile and update your profile picture*

---

<div align="center">

**Made with ❤️ using MERN Stack**

[⭐ Star this repo](https://github.com/parsapap/LetsChat-FullStack-ChatApp) • [🐛 Report Bug](https://github.com/parsapap/LetsChat-FullStack-ChatApp/issues) • [✨ Request Feature](https://github.com/parsapap/LetsChat-FullStack-ChatApp/issues)

</div>
