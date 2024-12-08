import { Router } from "express";
import { getTreeMusicObjects, getMusicContainersList, replaceMusicObject, deleteMusicObjects, getObjectTypes, createMusicObjects} from "./storageHandlers.js";

const storageRouter = Router();

storageRouter.get('/music_objects_tree', getTreeMusicObjects);
storageRouter.get('/music_objects/containers', getMusicContainersList);
storageRouter.post('/music_objects/replace', replaceMusicObject);
storageRouter.post('/music_objects/delete', deleteMusicObjects);
storageRouter.post('/music_objects', createMusicObjects)

storageRouter.get('/object_types', getObjectTypes);

export default storageRouter;