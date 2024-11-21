import express from "express";

import {
  getProduct,
  getSection,
  insertSection,
  insertStandardConsumption,
  requestStandartConsumptionDetail,
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

router.post("/standard-consumption", insertStandardConsumption);

router.get("/standard-consumption-detail", requestStandartConsumptionDetail);

export default router;
