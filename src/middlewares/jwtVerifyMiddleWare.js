import jwtLibrary from "../libraries/jwtLibrary.js"
const jwtLibraryObj = new jwtLibrary();

export const jwtVerifyToken = async (req, res, next )=>{
    try {
        const userAccessToken = req.headers["access-token"];
        const decode = await jwtLibraryObj.verifyJwtToken(req, userAccessToken );
    
        req.user = decode;
    } catch (error) {
        if (error.name == "TokenExpiredError") {
            res.status(401).json({code : 105, error : "jwt token is expired"})
        }
    }
    next();
}