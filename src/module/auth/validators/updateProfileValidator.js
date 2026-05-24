import { validateSchema } from "../../../../utils/validator.js";

//ajv validator for update profile api
const schema = {
  type: "object",
  properties: {
    fullName: { type: "string", minLength: 3 },
    phoneNumber: { 
        type: "number", 
        errorMessage: {
            type: "Phone number should be number"
        } 
    },
    address: { type: "string" }
  },
  required: [],
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
