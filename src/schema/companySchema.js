import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      index : true,
      required: true,
      trim: true,
    },

    foundedOn: {
      type: Date,
      required: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const companySchema = mongoose.model("Company", schema);
export default companySchema;