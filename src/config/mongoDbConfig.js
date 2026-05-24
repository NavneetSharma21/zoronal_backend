import mongoose from "mongoose";

const url = process.env.MONGODB_URL;
export const mongoConnection = async () => {
    try {
        await mongoose.connect(url);
        console.log("mongo db connected successfully");

    } catch (error) {
        return error;
    }
}