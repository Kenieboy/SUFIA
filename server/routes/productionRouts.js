import express from "express";

import {
  getDailyConsumptionData,
  getDailyConsumptionDataForUpdate,
  getItemDetailForMonthlyEntry,
  getMonthlyProductEntryData,
  getProduct,
  getProductionDetails,
  getSection,
  getStandardConsumptionData,
  getStandardConsumptionDataForUpdate,
  insertDailyConsumptionData,
  insertProductionDetails,
  insertSection,
  insertStandardConsumption,
  requestStandartConsumptionDetail,
  updateDailyConsumptionDetail,
  updateStandardConsumptionDetail,
} from "../models/productionModel.js";

// ==============================================

const router = express.Router();

//production

router.get("/", getProduct);

router.get("/section", getSection);

router.post("/section", insertSection);

router.post("/standard-consumption", insertStandardConsumption);
router.get("/standard-consumption", getStandardConsumptionData);
router.get(
  "/standard-consumption-data/:productItemId",
  getStandardConsumptionDataForUpdate
);

router.post(
  "/update-standard-consumption-detail",
  updateStandardConsumptionDetail
);

router.get("/standard-consumption-detail", requestStandartConsumptionDetail);

//daily consumption
router.post("/daily-consumption", insertDailyConsumptionData);

router.get("/daily-consumption", getDailyConsumptionData);
router.get(
  "/daily-consumption-data/:productItemId",
  getDailyConsumptionDataForUpdate
);

router.post("/update-daily-consumption-detail", updateDailyConsumptionDetail);

router.get("/item-details/:id", getItemDetailForMonthlyEntry);
router.post("/insertProductionWithDetails", insertProductionDetails);
router.get("/monthly-product-entry-data", getMonthlyProductEntryData);
router.get("/:productionId/details", getProductionDetails);

export default router;
