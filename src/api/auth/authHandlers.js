import { 
    createUser, 
    hashCredentials,
    test_db_connection,
    verifyCredentials,
    generateToken,
    verifyToken,
    getUserByUUID
} from "./authCallbacks.js";
import UserNotExists from "../../errors/UserNotExists.js";
import Response from "../../model/Response.js";

export async function login(req, res) {
    const tokenOptions = { expiresIn: "24h" };
    const { login, password } = req.body ?? {};
    console.log(req.body);
    
    try{
        if (login && password){
            const data = await verifyCredentials(login, password);
            
            if (!data) throw new UserNotExists();
            
            const token = generateToken(data, tokenOptions);
            res.status(200).json({accessToken: token, user: data});
        }
    }
    catch(err){
        res.status(err.code ?? 500).json({error: {msg: err.message ?? err }});
    }
}

export function registration(req, res) {
    const { username, login, password } = req.body ?? {};
    const { loginHash, passwordHash } = hashCredentials(login, password);
    console.log(username, loginHash, passwordHash);
    
    try{
        createUser(username, loginHash, passwordHash);
    }
    catch(err){
        res.json(err.message);
    }
}

export async function verifyAccessToken(req, res){
    const { accessToken } = req.body;
    
    try{
        const payload = verifyToken(accessToken);
        
        const user = await getUserByUUID(payload.id);
        res.json(new Response(user, null).toObject())
    }
    catch(err){
        res.json(new Response(null, err).toObject())
    }
    
}

export async function test_db_conn(req, res){
    await test_db_connection();
    res.sendStatus(200);
}
