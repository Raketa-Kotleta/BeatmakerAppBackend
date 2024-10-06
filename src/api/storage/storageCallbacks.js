import pgconnection from "../../services/pgconnection.js";

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

export async function loadObjectTypes() {
    const pgClient = await pgconnection.connectPgByDef();

    const query = { 
        text: `select * from get_object_types()`,
    }

    const response = await pgClient.query(query);

    pgClient.end();
    console.log(response.rows);
    
    return response.rows;
}

