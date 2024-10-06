export default class Response{
    error;
    data;

    constructor(data, error){

        this.error = [];
        this.data = [];

        if (error) this.error.push(error);
        if (data) {
            if (data instanceof Object){
                this.data.push(
                    data
                );
            }
            else{
                this.data.push(
                    { response: data }
                );
            }
        }
    }

    toObject(){
        return {
            error: this.error,
            data: this.data
        }
    }
}