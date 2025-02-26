import { Router } from "express";
import multer from "multer";
import { 
    createMusicObjects,
    getTreeMusicObjects, 
    getMusicContainersList, 
    updateMusicObject,
    deleteMusicObjects, 
    getObjectTypes, 
    createType,
    deleteTypes,
    updateType,
    uploadIcon
} from "./storageHandlers.js";

const storageRouter = Router();

storageRouter.get('/music_objects_tree', getTreeMusicObjects);
storageRouter.get('/music_objects/containers', getMusicContainersList);
storageRouter.put('/music_objects/:id', updateMusicObject);
storageRouter.post('/music_objects/:id', deleteMusicObjects);
storageRouter.post('/music_objects', createMusicObjects)

storageRouter.get('/object_types', getObjectTypes);
storageRouter.post('/object_types', createType);
storageRouter.delete('/object_types/:id', deleteTypes);
// storageRouter.put('/object_types', updateType);
storageRouter.post('/object_types/upload/:name', multer().single('imageuploader'), uploadIcon);

export default storageRouter;