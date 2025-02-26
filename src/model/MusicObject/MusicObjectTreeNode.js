export default class MusicObjectTreeNode{
    constructor(musicObject, level){
        this.init(musicObject, null, level);
    }

    init(musicObject, children = [], level = null){
        this.level = level;
        this.key = musicObject.id;
        this.data = musicObject;
        this.children = children ?? [];
    }
}