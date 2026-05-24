class userController {
    constructor({userService, commonHelpers}) {
        this.userService = userService;
        this.commonHelpers = commonHelpers;
    }

    /**
     * Not implemented on front end but we can use this auth module to login
     */
    
    // controller to handle user signup
    async signup(req, res, next){
        const returnData = await this.userService.signup(req.body);
        await this.commonHelpers.handleServiceResponse(req, res, returnData);
    }

    // controller to handle user login
    async login(req, res, next){
        const returnData = await this.userService.login(req.body);
            // handle to return refresh token at cookies only
        await this.commonHelpers.returnCookieForRefreshToken(req, res, returnData);
        await this.commonHelpers.handleServiceResponse(req, res, returnData);
    }

    
    // controller to handle user refresh token
    async refreshToken(req, res, next){
        const returnData = await this.userService.refreshToken(req.cookies);
            // handle to return refresh token at cookies only
        await this.commonHelpers.returnCookieForRefreshToken(req, res, returnData);
        await this.commonHelpers.handleServiceResponse(req, res, returnData);
    }

    
    // controller to handle user update profile
    async updateProfile(req, res, next){
        const returnData = await this.userService.updateProfile(req.user, req.body);
        await this.commonHelpers.handleServiceResponse(req, res, returnData);
    }
}

export default userController;