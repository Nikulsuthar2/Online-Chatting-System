import express from 'express'
import { handleGetAllChats, handleGetMessages, handleSendTextMessage } from '../controller/userChatController.js';


const chatRouter = express.Router()

chatRouter.post("/sendTextMsg", handleSendTextMessage);
chatRouter.get("/getAllChats", handleGetAllChats);
chatRouter.post("/getMassages", handleGetMessages);


export default chatRouter;