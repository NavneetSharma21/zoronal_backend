import { Router  } from "express";
// import container from "../../../dependency.js";
import { signupValidator } from "../validators/signupValidator.js";
import { loginValidator } from "../validators/loginValidator.js";
import container from "../../../../dependency.js";

// user auth related routes
const userAuth = Router();
//resolve user controller from the dependency
const { userController, jwtVerifyTokenMiddleWare} = container.cradle;

//user signup routes
userAuth.post("/signup", signupValidator,  (req, res, next) => {
    userController.signup(req, res, next);
});

//user login routes
userAuth.post("/login", loginValidator,  (req, res, next) => {
    userController.login(req, res, next);
})

export  { userAuth };

/**
 * Not implemented on front end but we can use this auth module to login
 */