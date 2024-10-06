export default class ParamNotLoaded extends Error{
    constructor(key){
        super("Env param " + key + " not found");
        this.name = "ParamNotLoaded"
    }
}