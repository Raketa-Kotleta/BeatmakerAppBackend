import { Router } from "express";
import { login, registration, test_db_conn, verifyAccessToken } from "./authHandlers.js";
import fetch from "node-fetch";
import http from 'node:http'

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/reg", registration);
authRouter.post("/accessTokenVerify", verifyAccessToken);
authRouter.post("/test_db_conn", test_db_conn);
authRouter.post('/yandex_login', async (req, res) => {
    const response = await fetch("https://functions.yandexcloud.net/d4efdqkqrbm5n4ugp4vu", {
        method: "post",
        body: JSON.stringify(req.body),
        headers: {'Content-Type': 'application/json'}
    });
    const data = await response.json();
    res.json(data);
})

authRouter.post("/yandex_accessTokenVerify", async (req, res) => {
    // console.log(req.body);
    const response = await fetch("https://functions.yandexcloud.net/d4ehntveg52u5k8933dl", {
        method: "post",
        body: JSON.stringify(req.body),
        headers: {'Content-Type': 'application/json'}
    });
    const data = await response.json();
    res.json(data);
});

export default authRouter;
