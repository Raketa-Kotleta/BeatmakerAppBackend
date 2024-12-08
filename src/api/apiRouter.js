import { Router } from "express";
import authRouter from "./auth/AuthRouter.js";
import storageRouter from "./storage/storageRouter.js";
import { Upload } from "@aws-sdk/lib-storage";
import getS3Client from "../services/yandex_cloud/s3client.js";

const apiRouter = Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/storage', storageRouter);
apiRouter.post('/upload/:name', async (req, res) => {
    const key = req.params.name
    const bucket = 'ms-one';
    const bucketStream = new Upload({
        client: getS3Client(),
        params:{
            Bucket: bucket,
            Key: key,
            Body: req,
            ContentType: 'audio/mpeg',
        }
    })
    bucketStream.on('httpUploadProgress', (progress) => {
        console.log("Загружена часть: " + progress.part);
    })

    await bucketStream.done();

    res.sendStatus(200);
    res.end();
})

export default apiRouter;