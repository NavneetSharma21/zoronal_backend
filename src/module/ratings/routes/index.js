import { Router  } from "express";
import container from "../../../../dependency.js";

const rating = Router();
//resolve controller from the dependency
const { ratingController, jwtVerifyTokenMiddleWare } = container.cradle;

// route to user add rating
rating.post("/addRating/:companyId", jwtVerifyTokenMiddleWare, (req, res, next) => {
    ratingController.addRating(req, res, next);
})

// route to user get rating list
rating.get("/getRatings/:companyId", jwtVerifyTokenMiddleWare, (req, res, next) => {
    ratingController.getRatings(req, res, next);
})

export  { rating };