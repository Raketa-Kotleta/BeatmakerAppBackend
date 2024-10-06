import { Router } from "express";
import { login, registration, test_db_conn, verifyAccessToken } from "./authHandlers.js";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/reg", registration);
authRouter.post("/accessTokenVerify", verifyAccessToken);
authRouter.post("/test_db_conn", test_db_conn);

export default authRouter;
