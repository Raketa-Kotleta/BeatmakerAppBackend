import { Router } from "express";
import authRouter from "./auth/AuthRouter.js";
import storageRouter from "./storage/storageRouter.js";

const apiRouter = Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/storage', storageRouter);

export default apiRouter;