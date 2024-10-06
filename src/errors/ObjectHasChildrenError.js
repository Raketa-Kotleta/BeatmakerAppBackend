import CustomError from "./CustomError.js";

class ObjectHasChildrenError extends CustomError{
    constructor(){
        super('Cannot do anymore. The object has children', 501);
    }
}

export default ObjectHasChildrenError;