import express from 'express'
import { handleGetAllChats, handleGetMessages, handleSeenStatus, handleSendTextMessage } from '../controller/userChatController.js';


const chatRouter = express.Router()

chatRouter.post("/sendTextMsg", handleSendTextMessage);
chatRouter.get("/getAllChats", handleGetAllChats);
chatRouter.post("/getMassages", handleGetMessages);
chatRouter.post("/setSeenStatus", handleSeenStatus);


export default chatRouter;