import pg from 'pg';
import appStore from '../store/state.js'

async function conntectPg(host, port, database){
    const {
        DATABASE_PASSWORD,
        DATABASE_USER
    } = appStore;

    const { Client } = pg;
    const client = new Client({
        user: DATABASE_USER,
        host: host,
        database: database,
        password: DATABASE_PASSWORD,
        post: port
    })
   
  
    await client.connect();
    
    return client;
}

async function connectPgByDef() {
    const {
        DATABASE_ADDRESS,
        DATABASE_PORT,
        DATABASE_SCHEMA,
    } = appStore;

    return await conntectPg(
        DATABASE_ADDRESS,
        DATABASE_PORT,
        DATABASE_SCHEMA
    );
}

export default{
    connectPgByDef,
    conntectPg,
}