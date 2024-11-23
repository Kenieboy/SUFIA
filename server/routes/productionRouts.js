import express from "express";

import {
  getProduct,
  getSection,
  insertDailyConsumptionData,
  insertSection,
  insertStandardConsumption,
  requestStandartConsumptionDetail,
} from "../models/productionModel.js";

// ==============================================

const router = express.Router();

//production

router.get("/", getProduct);

router.get("/section", getSection);

router.post("/section", insertSection);

router.post("/standard-consumption", insertStandardConsumption);

router.get("/standard-consumption-detail", requestStandartConsumptionDetail);

//daily consumption
router.post("/daily-consumption", insertDailyConsumptionData);

export default router;
