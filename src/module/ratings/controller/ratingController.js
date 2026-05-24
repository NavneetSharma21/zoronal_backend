class ratingController {
    constructor({ratingService, commonHelpers}) {
        this.ratingService = ratingService;
        this.commonHelpers = commonHelpers;
    }
    
    // controller to handle add company
    async addRating(req, res, next){
        const returnData = await this.ratingService.addRating(req.user, req.params, req.body);
        await this.commonHelpers.handleServiceResponse(req, res, returnData);
    }
    
    // controller to handle fetch company
    async getRatings(req, res, next){
        const returnData = await this.ratingService.getRatings(req.params, req.query);
        await this.commonHelpers.handleServiceResponse(req, res, returnData);
    } 
}

export default ratingController;