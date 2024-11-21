import express from 'express'
import { handleGetAllChats, handleGetMessages, handleReaction, handleSeenStatus, handleSendTextMessage } from '../controller/userChatController.js';


const chatRouter = express.Router()

chatRouter.post("/sendTextMsg", handleSendTextMessage);
chatRouter.get("/getAllChats", handleGetAllChats);
chatRouter.post("/getMassages", handleGetMessages);
chatRouter.post("/setSeenStatus", handleSeenStatus);
chatRouter.post('/reactMsg/:messageId', handleReaction);


export default chatRouter;