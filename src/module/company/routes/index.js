import { Router  } from "express";
import container from "../../../../dependency.js";
import { companyValidator } from "../validators/companyValidator.js";

// user auth related routes
const company = Router();
//resolve controller from the dependency
const { companyController, jwtVerifyTokenMiddleWare } = container.cradle;

// route to user add company
company.post("/addCompany", jwtVerifyTokenMiddleWare, companyValidator, (req, res, next) => {
    companyController.addCompany(req, res, next);
})

// route to user get company list
company.get("/getCompanies", jwtVerifyTokenMiddleWare, (req, res, next) => {
    companyController.getCompanies(req, res, next);
})

// route to user get company details
company.get("/getCompany/:id", jwtVerifyTokenMiddleWare, (req, res, next) => {
    companyController.getCompany(req, res, next);
})

export  { company };