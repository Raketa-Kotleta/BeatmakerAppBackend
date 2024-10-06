export default class User{
    uuid;
    username;
    role;
    constructor(uuid, username, role){
        this.uuid = uuid;
        this.username = username;
        this.role = role;
    }
}