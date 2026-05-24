import { validateSchema } from "../../../../src/utils/validator.js";

//ajv validator for signup api
const schema = {
  type: "object",
  properties: {
    fullName: { type: "string", minLength: 3 },
    email: { type: "string", format: "email" },
    phoneNumber: { 
        type: "number", 
        errorMessage: {
            type: "Phone number should be number"
        } 
    },
    address: { type: "string" },
    password: { type: "string" },
    cnfPassword: { 
        type: "string", 
        const: { $data: "1/password" },
        errorMessage: {
            const: "Password and Confirm Password must match"
        }
    }
  },
  required: ["fullName", "email", "password", "cnfPassword", "phoneNumber"],
  additionalProperties: true
};

export const signupValidator = (req, res, next) => {

    if (req.body.phoneNumber) {
        req.body.phoneNumber = parseInt(req.body.phoneNumber)
    }
    const isValid = validateSchema(req, schema);
    
    if (isValid) {   
        return res.status(400).json({ code: 105, errors : isValid.errors});
    }  
    next();  
}
