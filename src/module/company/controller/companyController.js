class companyController {
    constructor({companyService, commonHelpers}) {
        this.companyService = companyService;
        this.commonHelpers = commonHelpers;
    }
    
    // controller to handle add company
    async addCompany(req, res, next){
        const returnData = await this.companyService.addCompany(req.user, req.body, req.files);
        await this.commonHelpers.handleServiceResponse(req, res, returnData);
    }
    
    // controller to handle fetch company
    async getCompanies(req, res, next){
        const returnData = await this.companyService.getCompanies(req.query);
        await this.commonHelpers.handleServiceResponse(req, res, returnData);
    } 
    
    // controller to handle fetch company details
    async getCompany(req, res, next){
        const returnData = await this.companyService.getCompany(req.params);
        await this.commonHelpers.handleServiceResponse(req, res, returnData);
    }
}

export default companyController;