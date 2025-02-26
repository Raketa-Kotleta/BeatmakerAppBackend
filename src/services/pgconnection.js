import pg from 'pg';
import appStore from '../store/state.js';
import fs from 'node:fs';
import { yandexStore } from '../store/yandex.js';

export async function conntectPg(host, port, database){
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

export async function connectPgByDef() {
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

export class Postgres{
    static connection;
    static async initConnection(){
        const {
            DATABASE_ADDRESS,
            DATABASE_PORT,
            DATABASE_SCHEMA,
        } = appStore;
    
        Postgres.connection = await conntectPg(
            DATABASE_ADDRESS,
            DATABASE_PORT,
            DATABASE_SCHEMA
        );
    }

    static async initYandexCloudConnection(){
        const config = {
            connectionString:
                `postgres://${yandexStore.YANDEX_DATABASE_USER}:${yandexStore.YANDEX_DATABASE_PASSWORD}@rc1a-lx7vqthk35n6dqoh.mdb.yandexcloud.net:6432/${yandexStore.YANDEX_DATABASE_SCHEMA}`,
            ssl: {
                rejectUnauthorized: true,
                ca: fs
                    .readFileSync(yandexStore.YANDEX_DATABASE_CRT_PATH)
                    .toString(),
            },
        };
        const initalizedClient = new pg.Client(config);

        await initalizedClient.connect();

        Postgres.connection = initalizedClient;
    }
}

export default{
    Postgres,
    connectPgByDef,
    conntectPg
}
