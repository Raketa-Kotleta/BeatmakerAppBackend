import crypto from 'crypto'
import state from '../../store/state.js';
import pgconnection from "../../services/pgconnection.js";
import UserExists from '../../errors/UserExists.js';
import jwt from 'jsonwebtoken';
import UserNotExists from '../../errors/UserNotExists.js';
import User from '../../model/User.js';

const accessTokenPrefix = "Bearer ";
const salts = ['salt123', 'salt456']

export function hashCredentials(login, password){
    return {
        loginHash: crypto.createHash('sha512').update(login + salts[0]).digest('base64'),
        passwordHash: crypto.createHash('sha512').update(password + salts[1]).digest('base64'),
    }
}

export async function verifyCredentials(login, password){
    const { loginHash, passwordHash } = hashCredentials(login, password);
    
    const pgClient = await pgconnection.connectPgByDef();
    const res = await pgClient.query(`select * from get_user_by_cred('${loginHash}', '${passwordHash}')`)
    const data = res.rows[0];
    
    if (!data.id) return null;

    return data;
}

export async function createUser(username, login, password) {
    const pgClient = await pgconnection.connectPgByDef();
    const res = await pgClient.query(`select * from register_user('${username}', '${ login}', '${password}')`);
    
    const uuid = res.rows[0].register_user;
    if (uuid === null)
        throw new UserExists();


    return uuid;
}

export async function getUserByUUID(uuid){
    const pgClient = await pgconnection.connectPgByDef();
    const response = await pgClient.query(`select * from get_user_by_uuid('${uuid}')`)
    
    if (!response.rows[0].id) throw new UserNotExists();

    return new User(response.rows[0].id, response.rows[0].username, response.rows[0].role);
}

export function generateToken(payload, options) {
    return accessTokenPrefix + jwt.sign(payload, state.STOKEN, options)
}

export function verifyToken(token){
    if (!token.startsWith(accessTokenPrefix)) throw new Error();

    const preparedToken = token.replace(accessTokenPrefix, '');
    return jwt.verify(preparedToken, state.STOKEN);
}

export async function test_db_connection(){
    try{
        state.pgClient = await pgconnection.conntectPg(
            "localhost",
            5432,
            "oldbone_beats"
        );

        console.log(await state.pgClient.query('select now()'));
        
    }
    catch(e){
        console.log(e)
    }
}