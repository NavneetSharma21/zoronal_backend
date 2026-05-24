import Ajv from "ajv";
import addFormats from "ajv-formats";
import ajvErrors from "ajv-errors";

const ajv = new Ajv({ allErrors: true,  strict: false,  $data: true });

addFormats(ajv);
ajvErrors(ajv);

/**
 * Creates and returns a validation function
 * @param {Object} schema - JSON schema
 */
export const validateSchema = (req, schema) => {
    
    const validate = ajv.compile(schema);

    // check validation using request body 
    var valid;
    if (Object.keys(req.body).length === 0) {
        valid = validate(req.query);
    }else{
        valid = validate(req.body);
    }
    
    if (!valid) {
        return {
            valid,      
            errors: valid ? null : validate.errors.map(err =>  err.message )
        }; 
    }

    return null; // no errors  
};
