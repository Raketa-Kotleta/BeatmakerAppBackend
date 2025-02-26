import { Router } from "express";
import authRouter from "./auth/AuthRouter.js";
import storageRouter from "./storage/storageRouter.js";
import { uploadToBucket } from "../services/yandex_cloud/s3client.js";
import { yandexStore } from "../store/yandex.js";

const apiRouter = Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/storage', storageRouter);
apiRouter.post('/upload/:name', async (req, res) => {
    const key = yandexStore.OBJECTS_DIR + req.params.name;
    const contentType = 'audio/mpeg';

    const bucketStream = uploadToBucket(req, key, contentType);
    
    bucketStream.on('httpUploadProgress', (progress) => {
        console.log("Загружена часть: " + progress.part);
    })

    await bucketStream.done();

    res.sendStatus(200);
    res.end();
})

export default apiRouter;