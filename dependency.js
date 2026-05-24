import { asClass, asValue, createContainer } from "awilix";
import { responseCode } from "./src/constants/responseCodeConstants.js";
import { tableConstants } from "./src/constants/tableContants.js";
import commonHelpers from "./src/helpers/commonHelpers.js";
import jwtLibrary from "./src/libraries/jwtLibrary.js";
import { jwtVerifyToken } from "./src/middlewares/jwtVerifyMiddleWare.js";
import fileUpload from "./src/libraries/fileUpload.js";
import companyController from "./src/module/company/controller/companyController.js";
import companyService from "./src/module/company/services/companyService.js";
import companySchema from "./src/schema/companySchema.js";
import ratingSchema from "./src/schema/ratingSchema.js";
import ratingController from "./src/module/ratings/controller/ratingController.js";
import ratingService from "./src/module/ratings/services/ratingService.js";

// awilix dependency injection
const container = createContainer();

// common module related function
container.register({
    responseCode : asValue(responseCode),
    tableConstants : asValue(tableConstants),
    commonHelpers : asClass(commonHelpers).singleton(),  
    jwtLibrary : asClass(jwtLibrary).singleton(),
    jwtVerifyTokenMiddleWare : asValue(jwtVerifyToken),
    fileUpload : asClass(fileUpload).singleton(),

    companySchema : asValue(companySchema),
    ratingSchema : asValue(ratingSchema)
})

// implemented module related classes
container.register({
    companyController : asClass(companyController).singleton(),  
    companyService : asClass(companyService).singleton(),  

    ratingController : asClass(ratingController).singleton(),  
    ratingService : asClass(ratingService).singleton(),  
})

export default container;