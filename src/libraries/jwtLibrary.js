import jwt from "jsonwebtoken";

class jwtLibrary {
    constructor() {
        
    }
    
    //generate jwt token
    async generateJwtToken(userData, isRefreshToken = false){
        try {
            const expireTime = isRefreshToken ? "7d" : "15m"
            const secretKey = isRefreshToken ? process.env.REFRESH_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET;

            const token = jwt.sign( userData, secretKey, { expiresIn : expireTime})
    
            return token;
            
        } catch (error) {
            return error;
        }
    }

    //verify jwt token
    async verifyJwtToken(req, token, isRefreshToken = false){
        try {
            const secretKey = isRefreshToken ? process.env.REFRESH_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET;
            
            const decode = jwt.verify( token, secretKey)
        
            req.user = decode;
            return decode
        
        } catch (error) {
            throw error;
        }
    }
}

export default jwtLibrary;