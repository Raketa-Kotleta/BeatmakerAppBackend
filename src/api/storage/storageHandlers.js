import { getAllMusicObjects, replaceMusciObject, deleteObjects, deleteObjectFile, loadObjectTypes, createMusicObject } from './storageCallbacks.js';
import { ObjectTreeNode } from '../../model/ObjectTreeNode.js';
import { ObjectTreeConstructor } from '../../model/ObjectTreeConstructor.js';
import Response from '../../model/Response.js';
import ObjectHasChildrenError from '../../errors/ObjectHasChildrenError.js';

export async function getTreeMusicObjects(req, res){
    const objects = await getAllMusicObjects();
    const nodeList = objects.map(obj => new ObjectTreeNode(obj)); 

    const tree = new ObjectTreeConstructor(nodeList).createTree();
    
    res.status(200).json(tree);
}

export async function getMusicContainersList(req, res){
    const objects = (await getAllMusicObjects()).filter(el => el.func_type === 'container');

    res.status(200).json(objects);
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
        const response = await createMusicObject(data);

        if (!response) throw new Error("Ошибка создания объекта")
        res.status(200).json(new Response({ id: response}));
    }
    catch(err){
        res.json(new Response(null, err.message));
    }
}

export async function deleteMusicObjects(req, res) {
    const { musicDeleteData } = req.body;
    
    try{
        const filenames = Object.values(musicDeleteData).filter(data => Boolean(data));
        for (const name of filenames){
            deleteObjectFile(name);
        }
        const response = await deleteObjects(Object.keys(musicDeleteData));

        if (response === 0) throw new ObjectHasChildrenError("Ошибка удаления")
        res.status(200).json(new Response(response));
    }
    catch(err){
        res.json(new Response(null, err.message))
    }
}

export async function getObjectTypes(req, res) {
    try{
        const types = await loadObjectTypes();

        res.json(new Response(types).toObject());
    }
    catch(err){
        res.json(new Response(null, err.message))
    }
}
