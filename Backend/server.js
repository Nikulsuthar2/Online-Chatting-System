import 'dotenv/config'
import express from 'express';
import http from 'http';
import url from 'url'
import fs from 'fs';
import path from 'path'
import cors from 'cors';
import { Server as socketIo } from "socket.io";
import verifyJWT from './middleware/verifyJWT.js';
import cookieParser from 'cookie-parser';
import connectDB from './config/dbConn.js';
import mongoose from 'mongoose';
import corsOptions from './config/corsConfig.js'
import userAuthRouter from './routes/userAuthRouter.js';
import credentials from './middleware/credentials.js';
import userRouter from './routes/userRoute.js';
import chatRouter from './routes/chatRoute.js';
import activityRouter from './routes/activityRoute.js';

const PORT = process.env.PORT ?? 8000;

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();
const app = express();
const server = http.createServer(app);
const io = new socketIo(server, {
    // socket server config
    cors: {
      origin: "http://localhost:5173", // Your frontend's origin
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

app.get("/reqreader",(req, res)=> {
    res.send(req.headers);
})

// cors and cookie configuration
app.use(credentials);
app.use(cors(corsOptions));
app.use(cookieParser());

// enble request body parsing or reading
app.use(express.json());
app.use(express.urlencoded({extended:false}));

const dirPath = path.join(__dirname, 'uploads');

// Check if directory exists
try {
  // Check if directory exists, create if not
  await fs.promises.mkdir(path.join(__dirname, 'uploads'), { recursive: true });
  await fs.promises.mkdir(path.join(__dirname, 'public'), { recursive: true });
} catch (err) {
  console.error('Error creating directory:', err);
  res.status(500).send('file directory not created');
}

// upload directory public access
app.use(express.static(path.join(__dirname,"public")));
app.use("/uploads",express.static(path.join(__dirname,"uploads/")));

// custom routes
app.use("/auth", userAuthRouter);

app.use(verifyJWT);
app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/activity", activityRouter);

app.get("/",(req,res)=>{
    res.send("Welcome to ONLINE CHATING SYSTEM");
})

app.use((err,req,res,next)=> {
    console.log(err);
    next();
})

let totalUserLive = 0;
let connectedUsers = []
io.on("connection", (socket) => {
    const userId = socket.handshake.auth.userId; // Access user ID from client
    console.log(`User connected: ${userId}`);
    if(!connectedUsers.includes(userId)){
        connectedUsers.push(userId);
        totalUserLive++;
    }
    console.log("total users live: " + totalUserLive);
  
    // socket.on("sendMessage", ({ sender, receiver, message }) => {
    //   console.log(`Message from ${sender} to ${receiver}: ${message}`);
    //   let messages = JSON.parse(fs.readFileSync(messagesFilePath, "utf-8"));
    //   const newMessage = { sender, receiver, message, timestamp: new Date() };
    //   messages.push(newMessage);
    //   fs.writeFileSync(messagesFilePath, JSON.stringify(messages));
  
    //   // Emit the message to the receiver 
    //   io.to(receiver).emit("receiveMessage", newMessage);
    // });
  
    // socket.on("join", (username) => {
    //   const existingUserSocket = Object.keys(connectedUsers).find(
    //     (key) => connectedUsers[key] === username
    //   );
  
    //   if (existingUserSocket) {
    //     delete connectedUsers[existingUserSocket]; // Remove old user session
    //   }
    //   socket.username = username; // Attach the username to the socket
    //   connectedUsers[socket.id] = username;
    //   socket.join(username);
    //   console.log(`${username} joined`);
    // });
  
    socket.on("disconnect", () => {
      totalUserLive--;
      console.log('A user disconnected @'+socket.handshake.auth.username);
      connectedUsers = connectedUsers.filter(item => item !== socket.handshake.auth.userId);
      // Optionally broadcast to other users that someone has disconnected
      //io.emit('userDisconnected', { username: disconnectedUsername });
  
      //delete connectedUsers[socket.id];
    });
  });

mongoose.connection.once('open', ()=>{
    console.log("connected to mongoDB");
    server.listen(PORT, ()=> {
        console.log(`Server is running on port ${PORT}`)
        console.log(`http://localhost:${PORT}`)
    })
})
