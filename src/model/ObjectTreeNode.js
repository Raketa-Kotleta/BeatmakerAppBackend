export class ObjectTreeNode {
    key;
    data;
    level;
    children
    constructor(cfg){
        this.key = cfg.id_;
        this.children = [];
        this.data = cfg;
        this.level = cfg.level;
    }

    getValues(){
        return{
            key: this.key,
            data: this.data,
            level: this.level,
            children: this.children
        }
    }
} 