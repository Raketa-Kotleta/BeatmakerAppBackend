import { ObjectTreeNode } from "./ObjectTreeNode.js";

export class ObjectTreeConstructor{
    list;
    map;
    constructor(nodesList){
        this.list = nodesList;
        this.map = {};
        this._createNodesMap(nodesList);
    }

    _createNodesMap(nodesList){
        nodesList.forEach(item => {
            this.map[item.data.id_] = item;
        });
    }

    add(node){
        this.map[node.data.id_] = node;
        this.list.push(node);
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
        const tree = [];
        const rootNode= new ObjectTreeNode({
            id_: 0,
            name_: 'ROOT',
            pid: null,
            func_type: 'container',
            type_: 'folder',
            icon_: 'folder_icon.svg',
        });
        rootNode.level = -1;
        
        this.list.forEach(item => {
            if (item.data.pid === 0) {
                tree.push(item);
            } else if (this.map[item.data.pid]) {
                this.map[item.data.pid].children.push(this.map[item.data.id_]);
            }
        });

        this._defineTreeLevels(tree);
        
        rootNode.children = tree;

        return rootNode;
    }
}