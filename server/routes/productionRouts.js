import express from "express";

import { getProduct } from "../models/productionModel.js";

// ==============================================

const router = express.Router();

//production

router.get("/", getProduct);

export default router;
