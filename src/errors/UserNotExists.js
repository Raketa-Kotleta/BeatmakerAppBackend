import CustomError from "./CustomError.js";

class UserNotExists extends CustomError{
    constructor(){
        super('User not found', 404);
    }
}

export default UserNotExists;