import path from "path";
import { existsSync, mkdirSync } from "fs";
import { randomUUID } from "crypto";
class fileUpload {
    constructor() {
        
    }

    // upload file in upload folder
    async uploadSingleFile(file){
        try {
            const folderPath = path.join(process.cwd(), "upload");
            
            // Create folder recursively
            if (!existsSync(folderPath)) {
                mkdirSync(folderPath, { recursive: true });
            }
            const fileExtension = file.name.split(".")[1];
            const fileName = `${randomUUID()}.${fileExtension}`

            const uploadPath = path.join(folderPath, fileName);

            await file.mv(uploadPath);

            return fileName
            
        } catch (error) {
            return error;
        }
    }
}

export default fileUpload;