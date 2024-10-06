class CustomError extends Error{
    code;
    constructor(message, code){
        super(message);
        this.code = code;
    }
}

export default CustomError;