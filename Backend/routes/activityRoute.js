import express from 'express'
import { handleGetTypingStatus, handleTypingStatus } from '../controller/activityController.js';


const activityRouter = express.Router()

activityRouter.post("/sendTypingStatus", handleTypingStatus);
activityRouter.post("/getTypingStatus", handleGetTypingStatus);


export default activityRouter;