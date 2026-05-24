import { validateSchema } from "../../../utils/validator.js";

//ajv validator for company api
const schema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 3 },
    location: { 
        type: "string", 
        errorMessage: {
            type: "required property location"
        } 
    },
    foundedOn: { type: "string", format: "date" },
    city : {
        type : "string",
    },
    image : {
        "type": "object",
        "properties": {
            "name": { "type": "string" },
            "mimetype": { "type": "string", "enum": ["image/jpeg", "image/jpg", "image/png"] },
            //max 5 mb file
            "size": { "type": "integer", "minimum": 1, "maximum": 5189498 }
        },
        "required": ["name", "mimetype", "size"],
        "additionalProperties": true
    }  
  },
  required: ["name", "city", "image", "foundedOn", "location"],
  additionalProperties: true
};

export const companyValidator = (req, res, next) => {
    if (req.files && req.files.image ) {
        req.body.image = req.files.image
    }
    const isValid = validateSchema(req, schema);
    
    if (isValid) {   
        return res.status(400).json({ code: 105, errors : isValid.errors});
    }  
    next();  
}
