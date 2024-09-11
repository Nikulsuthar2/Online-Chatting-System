import 'dotenv/config'
import express from 'express';
import url from 'url'
import path from 'path'
import cors from 'cors';
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

mongoose.connection.once('open', ()=>{
    console.log("connected to mongoDB");
    app.listen(PORT, ()=> {
        console.log(`Server is running on port ${PORT}`)
        console.log(`http://localhost:${PORT}`)
    })
})
