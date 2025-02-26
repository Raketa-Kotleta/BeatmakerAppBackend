import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getS3Client } from "../../services/yandex_cloud/s3client.js";
import Crudable from "../Crudable.js";
import { yandexStore } from "../../store/yandex.js";

export default class ObjectType extends Crudable{
    constructor(id, name, icon, funcTypeId, funcType, publishable){
        super();
        this.init(id, name, icon, funcTypeId, funcType, publishable);
    }

    init(id, name, icon, funcTypeId, funcType, publishable){
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.funcTypeId = funcTypeId;
        this.funcType = funcType;
        this.publishable = publishable;
    }

    async create(){
        const dto = [this.name, this.icon, this.funcTypeId, this.publishable];

        const query = {
            text: 'select * from create_object_type($1, $2, $3, $4)',
            values: dto,
        }

        return (await this._fetch(query)).data[0].create_object_type;
    }

    async update(){
        const dto = [this.id, this.name, this.publishable];

        const query = {
            text: 'select * from update_object_type($1, $2, $3)',
            values: dto,
        }

        return (await this._fetch(query)).data;
    }

    async delete(){
        const dto = [this.id];

        const query = {
            text: 'select * from delete_object_type($1)',
            values: dto
        }

        return (await this._fetch(query)).data[0].delete_object_type
    }

    async get(){
        const dto = [this.id];

        const query = {
            text: 'select * from object_types where id_ = $1',
            values: dto
        }

        return (await this._fetch(query)).data[0]
    }

    deleteFile(){
        const s3client = getS3Client();
        const request = new DeleteObjectCommand({
            Key: yandexStore.ICONS_DIR + this.icon,
            Bucket: yandexStore.BUCKET_NAME,
        });

        s3client.send(request);
    }

    toObject(){
        const { 
            id,
            name,
            icon,
            funcTypeId,
            funcType,
            publishable
        } = this;
        
        return {
            id,
            name,
            icon,
            funcTypeId,
            funcType,
            publishable,
        }
    }
} 