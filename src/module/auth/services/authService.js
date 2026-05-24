import { StatusCodes } from "http-status-codes";
import { compare, hash } from "bcrypt";
class userService {
    constructor({commonHelpers, tableConstants, jwtLibrary}) {
        this.commonHelpers = commonHelpers;
        this.tableConstants = tableConstants;
        this.jwtLibrary = jwtLibrary
    }

    /**
     * Not implemented on front end but we can use this auth module to login
     */
    
    /**
     * User signup service
     * @param {*} reqData 
     */
    async signup(reqData){
        try {
            const { fullName, address, email, phoneNumber, password, cnfPassword } = reqData;
            // if email already exist
            const isExistEmail = await this.db(this.tableConstants.USERS).where({email : email}).first();
    
            if (isExistEmail) return await this.commonHelpers.prepareResponse(StatusCodes.BAD_REQUEST, "EMAIL_ALREADY_EXIST");

            //if password and confirm password is not matched
            if (password !== cnfPassword) return await this.commonHelpers.prepareResponse(StatusCodes.BAD_REQUEST, "PASSWORD_AND_CONF_PASSWORD_SHOULD_BE_SAME");

            
            const cryptPassword = await hash(password, 10)
            const insertData = {
                fullName, 
                address,
                email, 
                phoneNumber,
                password : cryptPassword
            }

            // user entry in
            await this.db(this.tableConstants.USERS).insert(insertData);
            return await this.commonHelpers.prepareResponse(StatusCodes.OK, "SUCCESS");

        } catch (error) {
            return error;
        }
    }

    /**
     * User login service
     * @param {*} reqData 
     */
    async login(reqData){
        try {
            const { email,  password } = reqData;
            // if email already exist
            const isUserExist = await this.db(this.tableConstants.USERS).where({email : email}).first();
            
            if (!isUserExist) return await this.commonHelpers.prepareResponse(StatusCodes.BAD_REQUEST, "USER_NOT_FOUND");

            const isMatched = await compare(password, isUserExist.password)
            //if password is wrong provided
            if (!isMatched) return await this.commonHelpers.prepareResponse(StatusCodes.BAD_REQUEST, "PROVIDED_PASSWORD_IS_WRONG");

            const generateAccessToken = await this.jwtLibrary.generateJwtToken({ userId : isUserExist.id, email : isUserExist.email})

            const generateRefreshToken = await this.jwtLibrary.generateJwtToken({ userId : isUserExist.id}, true)
            
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);

            let resFreshTokens = []
            if (isUserExist.refreshTokens) {
                resFreshTokens = typeof isUserExist.refreshTokens == "string" ?  JSON.parse(isUserExist.refreshTokens)
                : isUserExist.refreshTokens;
            }

            resFreshTokens.push({
                token : generateRefreshToken,
                expiresAt : expiresAt,
                createdAt : new Date()
            })

            if (resFreshTokens.length > 5) {
                resFreshTokens.shift();
            }          
        
            await this.db(this.tableConstants.USERS).where({"email" : email}).update({"refreshTokens" : JSON.stringify(resFreshTokens)});

            const loginResponse = {
                userId : isUserExist.id, 
                email : isUserExist.email,
                address : isUserExist.address,
                phoneNumber : isUserExist.phoneNumber,
                accessToken : generateAccessToken,
                refreshToken : generateRefreshToken
            }
            // return login response 
            return await this.commonHelpers.prepareResponse(StatusCodes.OK, "SUCCESS", loginResponse);
            
        } catch (error) {
            return error;
        }
    }

    /**
     * User refresh token when access token is expires
     * @param {*} reqCookies 
     * @returns 
     */
    async refreshToken(reqCookies){
        try {
            const { refreshToken } = reqCookies;
                    
            if (!refreshToken) return await this.commonHelpers.prepareResponse(StatusCodes.BAD_REQUEST, "INVALID_REFRESH_TOKEN");

            const decode = await this.jwtLibrary.verifyJwtToken({}, refreshToken, true);
            
            if (!decode?.userId) return await this.commonHelpers.prepareResponse(StatusCodes.BAD_REQUEST, "INVALID_REFRESH_TOKEN");

            const userDetails = await this.db(this.tableConstants.USERS).where({id: decode.userId}).first();

            if (!userDetails) {
                return await this.commonHelpers.prepareResponse(StatusCodes.BAD_REQUEST, "USER_NOT_FOUND")
            }       

            let refreshTokens = [];
            if (userDetails.refreshTokens) {
                refreshTokens = typeof userDetails.refreshTokens == "string" ? JSON.parse(userDetails.refreshTokens) : userDetails.refreshTokens;
            }
            
            const existingToken = refreshTokens.find(data => data.token == refreshToken);
            
            if (!existingToken) {
                return await this.commonHelpers.prepareResponse(StatusCodes.BAD_REQUEST, "REFRESH_TOKEN_MISMATCHED")
            }   

            // Check expiry manually (extra safety)
            if (new Date(existingToken.expiresAt) < new Date()) {
                return await this.commonHelpers.prepareResponse(
                    StatusCodes.BAD_REQUEST,
                    "REFRESH_TOKEN_EXPIRED"
                );
            }


            //remove old token
            refreshTokens = refreshTokens.filter(t => t.token !== refreshToken);

            // Prepare Expiry (example: 7 days)
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);            

            const generateNewAccessToken = await this.jwtLibrary.generateJwtToken({userId : userDetails.id, email : userDetails.email })

            const generateNewRefreshToken = await this.jwtLibrary.generateJwtToken({userId : userDetails.id, email : userDetails.email }, true);

            refreshTokens.push({
                token: generateNewRefreshToken,
                expiresAt,
                createdAt: new Date()
            });

            if (refreshTokens.length > 5) {
                refreshTokens.shift();
            }

            await this.db(this.tableConstants.USERS).where({id : userDetails.id}).update({refreshTokens : JSON.stringify(refreshTokens)});

            return await this.commonHelpers.prepareResponse(StatusCodes.OK, "SUCCESS", {
                id : userDetails.id,
                email : userDetails.email,
                name : userDetails.name,
                accessToken : generateNewAccessToken, 
                refreshToken :generateNewRefreshToken
            })

        } catch (error) {
            return error;
        }
    }

    // /**
    //  * service to update user profile data
    //  * @param {} reqData 
    //  * @returns 
    //  */
    // async updateProfile(reqUser, reqData){
    //     try {
    //         const { userId } = reqUser;
    //         const { fullName, address, phoneNumber } = reqData;

    //         const isUserExist = await this.db(this.tableConstants.USERS).where({ id : userId})

    //         if (!isUserExist) return await this.commonHelpers.prepareResponse(StatusCodes.BAD_REQUEST, "USER_NOT_FOUND");
            
    //         await this.db(this.tableConstants.USERS).where({id : userId}).update({fullName, address, phoneNumber});

    //         return await this.commonHelpers.prepareResponse(StatusCodes.OK, "SUCCESS");
    //     } catch (error) {
    //         return error;
    //     }
    // }
}

export default userService;