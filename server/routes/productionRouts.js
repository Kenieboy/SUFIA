import express from "express";

import {
  getProduct,
  getSection,
  insertSection,
} from "../models/productionModel.js";

// ==============================================

const router = express.Router();

//production

router.get("/", getProduct);

//production section
router.get("/section", getSection);
// router.get("/production/section/:Id", getSectionId);
router.post("/section", insertSection);
// router.put("/production/section", updateSection);

export default router;
