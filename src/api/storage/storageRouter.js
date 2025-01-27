import { Router } from "express";
import { 
    createMusicObjects,
    getTreeMusicObjects, 
    getMusicContainersList, 
    replaceMusicObject, 
    deleteMusicObjects, 
    getObjectTypes, 
    createObjectType,
    deleteObjectTypes,
    updateObjectType
} from "./storageHandlers.js";

const storageRouter = Router();

storageRouter.get('/music_objects_tree', getTreeMusicObjects);
storageRouter.get('/music_objects/containers', getMusicContainersList);
storageRouter.post('/music_objects/replace', replaceMusicObject);
storageRouter.post('/music_objects/delete', deleteMusicObjects);
storageRouter.post('/music_objects', createMusicObjects)

storageRouter.get('/object_types', getObjectTypes);
storageRouter.post('/object_types', createObjectType);
storageRouter.post('/object_types/delete', deleteObjectTypes);
storageRouter.put('/object_types', updateObjectType);
export default storageRouter;