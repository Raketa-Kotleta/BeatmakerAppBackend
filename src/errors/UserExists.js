import CustomError from "./CustomError.js";

class UserExists extends CustomError{
    constructor(){
        super('User already registred', 500);
    }
}

export default UserExists;