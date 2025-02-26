import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getS3Client } from "../../services/yandex_cloud/s3client.js";
import Crudable from "../Crudable.js";
import { yandexStore } from "../../store/yandex.js";

export default class MusicObject extends Crudable{
    constructor(id, name, creationDate, typeId, type, filename, pid, icon, funcTypeId){
        super();
        this.init(id, name, creationDate, typeId, type, filename, pid, icon, funcTypeId);
    }

    init(id, name, creationDate, typeId, type, filename, pid, icon, funcTypeId){
        this.id = id; 
        this.name = name;
        this.creationDate = creationDate;
        this.typeId = typeId;
        this.type = type;
        this.filename = filename;
        this.pid = pid;
        this.icon = icon;
        this.funcTypeId = funcTypeId;
    }

    async delete(){
        const s3client = getS3Client();
        const request = new DeleteObjectCommand({
            Key: yandexStore.OBJECTS_DIR + this.filename,
            Bucket: yandexStore.BUCKET_NAME,
        });

        await s3client.send(request);

        const query = {
            text: 'select * from  delete_storage_object($1)',
            values: [this.id]
        }

        return (await this._fetch(query)).data.delete_storage_object;
    }

    async create(){
        const query = { 
            text: `select * from create_storage_object($1, $2, $3, $4, $5)`,
            values:[this.name, this.creationDate, this.typeId, this.filename, this.pid],
        }
    
       return (await this._fetch(query)).data;
    }

    async update(){
        const query = { 
            text: `select * from update_storage_object($1, $2, $3, $4)`,
            values:[this.id, this.name, this.filename, this.pid],
        }

        return (await this._fetch(query)).data;
    }

    async get(){
        const query = {
            text: `select * from get_storage_object($1)`,
            values: [this.id]
        }

        return (await this._fetch(query)).data;
    }

    static fromDatabase(data){
        const args = [
            data.id_, 
            data.name_, 
            data.creation_date, 
            data.type_id, 
            data.type_, 
            data.filename, 
            data.pid, 
            data.icon_, 
            data.func_type_id
        ];

        return args;
    }

    toObject(){
        return {
            id: this.id,
            name: this.name,
            creationDate: this.creationDate,
            typeId: this.typeId,
            type: this.type,
            filename: this.filename,
            pid: this.pid,
            icon: this.icon,
            funcTypeId: this.funcTypeId
        }
    }
}