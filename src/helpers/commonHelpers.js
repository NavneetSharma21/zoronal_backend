class commonHelpers {
    constructor({ responseCode}) {
        this.responseCode = responseCode
    }

    async getResponseCode(key){
        return this.responseCode[key]
    }
    
    // return response to controller from service
    async prepareResponse(status, message, response){
        const returnResponse = response ? response : [];
        
        return {
            status : status,
            code : await this.getResponseCode(message),
            response : returnResponse
        }
    }

    // handle service response
    async handleServiceResponse(req, res, {status, code, response}){
        return  res.status(status).json({ 
            code, response
        });
    }

    // handle cookie response fro refresh token
    async returnCookieForRefreshToken(req, res, returnData){
        try {
            if (returnData.status === 200 && returnData.response?.refreshToken) {
                res.cookie("refreshToken", returnData.response.refreshToken, 
                    {
                        httpOnly: true,
                        secure: false, // true in production
                        sameSite: "strict",
                        maxAge: 7 * 24 * 60 * 60 * 1000
                    }
                );  
                delete returnData.response.refreshToken;         
            }
        } catch (error) {
            throw error;
        }
    }
}

export default commonHelpers;