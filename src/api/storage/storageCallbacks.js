import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import pgconnection from "../../services/pgconnection.js";
import getS3Client from "../../services/yandex_cloud/s3client.js";

export async function getAllMusicObjects(){
    const pgClient = await pgconnection.connectPgByDef();

    const response = await pgClient.query(`select * from get_all_storage_objects()`);

    pgClient.end();
    
    return response.rows;
}

export async function replaceMusciObject(ids, pid) {
    const pgClient = await pgconnection.connectPgByDef();

    const query = { 
        text: `select * from replace_storage_objects($1, $2)`,
        values:[ids, pid],
    }

    const response = await pgClient.query(query);

    pgClient.end();
    
    return response.rows[0];
}

export async function deleteObjects(ids) {
    const pgClient = await pgconnection.connectPgByDef();

    const query = { 
        text: `select * from delete_storage_objects($1)`,
        values:[ids],
    }

    const response = await pgClient.query(query);

    pgClient.end();
    
    return response.rows[0];
}

export function deleteObjectFile(filename) {
    const s3client = getS3Client();
    const bucket = 'ms-one';
    const request = new DeleteObjectCommand({
        Key: filename,
        Bucket: bucket,
    });

    return s3client.send(request);
    
}

export async function loadObjectTypes() {
    const pgClient = await pgconnection.connectPgByDef();

    const query = { 
        text: `select * from get_object_types()`,
    }

    const response = await pgClient.query(query);

    pgClient.end();
    
    return response.rows;
}

export async function createMusicObject(data){
    const pgClient = await pgconnection.connectPgByDef();

    const query = { 
        text: `select * from create_storage_object($1, $2, $3, $4, $5)`,
        values:[data.name_, data.creation_date, data.type_id, data.filename, data.pid],
    }

    const response = await pgClient.query(query);

    pgClient.end();
    
    return response.rows[0].create_storage_object;
}

