import { 
    getAllMusicObjects,
    replaceMusciObject, 
    deleteObjects, 
    loadObjectTypes, 
    createMusicObject,
    uploadObjectIcon,
    createObjectType
} 
from './storageCallbacks.js';
import Response from '../../model/Response.js';
import ObjectHasChildrenError from '../../errors/ObjectHasChildrenError.js';
import MusicObjectCollection from '../../model/MusicObject/MusicObjectCollection.js';
import MusicObject from '../../model/MusicObject/MusicObject.js';
import ObjectTypeCollection from '../../model/ObjectType/ObjectTypeCollection.js';
import ObjectType from '../../model/ObjectType/ObjectType.js';

export async function getTreeMusicObjects(req, res){
    const collection = new MusicObjectCollection();
    const data = await collection.get();
    collection.init(MusicObjectCollection.fromDatabase(data)); 
    
    const tree = collection.createTree();
    
    res.status(200).json(tree);
}

export async function getMusicContainersList(req, res){
    const objects = (await getAllMusicObjects()).filter(el => el.func_type === 'container');

    res.status(200).json(objects);
}

export async function updateMusicObject(req, res) {
    const { body, params } = req;
    try{
        const musicObject = new MusicObject(
            params.id,
            body.name,
            body.creationDate,
            body.typeId,
            body.type,
            body.filename,
            body.pid,
            body.icon,
            body.funcTypeId
        );
    
        await musicObject.update();
        res.status(200).json(new Response({response: 1}));
    }
    catch(err){
        res.json(new Response(null, err.message))
    }
}

export async function replaceMusicObject(req, res) {
    const {keys, pid} = req.body;
    
    try{
        const response = await replaceMusciObject(keys, pid);
        res.status(200).json(new Response(response));
    }
    catch(err){
        res.json(new Response(null, err.message))
    }
}

export async function createMusicObjects(req, res) {
    const data = req.body;
    try{
        const musicObject = new MusicObject(
            null, 
            data.name, 
            data.creationDate,
            data.typeId,
            data.type,
            data.filename,
            data.pid,
            data.icon,
            data.funcTypeId
        );
        
        const response = (await musicObject.create())[0].create_storage_object;

        if (!response) throw new Error("Ошибка создания объекта")
        res.status(200).json(new Response({ id: response}));
    }
    catch(err){
        res.json(new Response(null, err.message));
    }
}

export async function deleteMusicObjects(req, res) {
    try{
        const musicObject = new MusicObject(req.params.id);
        const args = MusicObject.fromDatabase((await musicObject.get())[0]);
        musicObject.init(...args);
        
        const response = (await musicObject.delete());

        if (response === 0) throw new ObjectHasChildrenError("Ошибка удаления")
        res.status(200).json(new Response(response));
    }
    catch(err){
        console.log(err);
        
        res.json(new Response(null, err.message))
    }
}

export async function getObjectTypes(req, res) {
    try{
        const collection = new ObjectTypeCollection();
        const types = ObjectTypeCollection.fromDatabase(await collection.get());
        collection.init(types);

        res.json(new Response(collection.toObject()));
    }
    catch(err){
        res.json(new Response(null, err.message))
    }
}

export async function createType(req, res) {
    try {
        const {body} = req;
        const type = new ObjectType(
            body.id, 
            body.name, 
            body.icon, 
            body.functionalType.id, 
            body.functionalType.name, 
            body.publishable
        );
        const id = (await type.create());
        
        res.json(new Response(id));
    } 
    catch (error) {
        res.json(new Response(null, error.message));
    }
};
export async function deleteTypes(req, res) {
    const { id } = req.params;
    const type = new ObjectType(id);
    const data = await type.get();
    type.init(id, data.type_, data.icon_, data.funcTypeId, null, data.publishable);
    
    try{
        const response = await type.delete();
        if (!response)  throw new Error("Невозможно удалить тип, так как существуют объекты этого типа")
        type.deleteFile();
        res.status(200).json(new Response({status: 1}, null));
    }
    catch(err){
        res.json(new Response(null, err.message));
    }   
}
export async function updateType(req, res) {

}

export async function uploadIcon(req, res) {
    uploadObjectIcon(req, res);
    res.sendStatus(200);
    res.end();
}
