class apiResponse {
    constructor(
        statusCode = 200 ,
        data ,
        meseage= 'Success',
        
    )
    {
        this.statusCode = statusCode;
        this.meseage = meseage;
        this.data = data;
    }
}
export default apiResponse