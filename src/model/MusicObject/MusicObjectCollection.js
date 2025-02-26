import Crudable from "../Crudable.js";
import MusicObject from "./MusicObject.js";
import MusicObjectTreeNode from "./MusicObjectTreeNode.js";

export default class MusicObjectCollection extends Crudable{
    constructor(musicObjects){
        super();
        this.init(musicObjects);
    }
    
    init(collection){
        this.collection = collection ?? [];
    }

    async get(){
        const query = {
            text: `select * from get_all_storage_objects()`,
        }

        return (await this._fetch(query)).data;
    }

    static fromDatabase(data){
        const musicObjects = [];

        for (const item of data) {
            musicObjects.push(
                new MusicObject(
                    item.id_,
                    item.name_,
                    item.creation_date,
                    item.type_id ,
                    item.type_,
                    item.filename,
                    item.pid,
                    item.icon_,
                    item.func_type_id 
                )
            );
        }

        return musicObjects;
    }

    _createNodesMap(nodes){
        const map = {};
        nodes.forEach(item => {
            map[item.data.id] = item;
        });

        return map;
    }

    _defineTreeLevels(tree){
        let level = 0;
        let currentNode = 0;
        let stack = [...tree]; 
        
        for (const root of tree){
            root.level = 0;
        }
    
        while(currentNode = stack.pop()){
            level = currentNode.level;
            for (const child of currentNode.children){
                child.level = level + 1;
            }
            stack = [...stack, ...currentNode.children];
        }   
    }
    
    createTree(){
        const nodes = this.collection.map(o => new MusicObjectTreeNode(o.toObject()));
        const map = this._createNodesMap(nodes);
        const tree = [];
        const rootNode = new MusicObjectTreeNode(
            new MusicObject(
                0,
                'ROOT',
                null,
                null,
                'folder',
                'ROOT',
                null,
                'folder_icon.svg',
                1
            ).toObject(),
            -1
        );
        
        nodes.forEach(item => {
            if (item.data.pid === 0) {
                tree.push(item);
            } else if (map[item.data.pid]) {
                map[item.data.pid].children.push(map[item.data.id]);
            }
        });

        this._defineTreeLevels(tree);
        
        rootNode.children = tree;

        return rootNode;
    }
    
    toObject(){
        return this.collection.map(
            o => o.toObject()
        );
    }
}