class ApiResponse{
    constructor(statuscode, message, data){
        this.statuscode = statuscode;
        this.message = message;
        this.data = data;
        this.success=statuscode>=200 && statuscode<300;
    }
}