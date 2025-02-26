import { Postgres } from "../services/pgconnection.js";

export default class Crudable{
    _connection;
    constructor(){
        this._connection = Postgres.connection;
    }

    async create(){return;};
    async update(){return;};
    async delete(){return;};
    async get(){return;};

    static fromDatabase(data){};

    async _fetch(query){
        const response = await this._connection.query(query);
        
        return {
            response,
            data: response.rows,
        }
    }

    toObject(){
        return {};
    }
}