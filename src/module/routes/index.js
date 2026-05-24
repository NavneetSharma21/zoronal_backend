import { Router } from "express";
import { company } from "../company/routes/index.js";
import { rating } from "../ratings/routes/index.js";

const allRoutes = Router();

allRoutes.use("/company", company )
allRoutes.use("/rating", rating);

export { allRoutes };