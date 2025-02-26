import Crudable from "../Crudable.js";
import ObjectType from "./ObjectType.js";

export default class ObjectTypeCollection extends Crudable{
    constructor(types){
        super();
        this.init(types);
    }

    init(types){
        this.types = types ?? [];
    }

    async get(){
        const query = { 
            text: `select * from get_object_types()`,
        }

        return (await this._fetch(query)).data;
    }

    static fromDatabase(data){
         const types = [];
    
        for (const item of data) {
            types.push(
                new ObjectType(
                    item.id_,
                    item.name_,
                    item.icon_,
                    item.func_type_id,
                    item.func_type,
                    item.publishable
                )
            );
        }

        return types;
    }

    toObject(){
        return this.types.map(type => type.toObject());
    }
}