import express from "express";

//department
import {
  getDeparment,
  getDepartmentId,
  insertDepartment,
  updateDepartment,
} from "../models/departmentModel.js";

//section
import {
  getSection,
  getSectionId,
  insertSection,
  updateSection,
} from "../models/sectionModel.js";

//item class
import {
  getItemClass,
  getItemClassId,
  insertItemClass,
  updateItemClass,
} from "../models/itemClassModel.js";

//item category
import {
  getItemCategory,
  getItemCategoryId,
  insertItemCategory,
  updateItemCategory,
} from "../models/itemCategoryModel.js";

//item unit
import {
  getItemUnit,
  getItemUnitId,
  insertItemUnit,
  updateItemUnit,
} from "../models/itemUnitModel.js";

// ==============================================

const router = express.Router();

//department

router.get("/department", getDeparment);
router.get("/department/:Id", getDepartmentId);
router.post("/department", insertDepartment);
router.put("/department", updateDepartment);

//department end

//section

router.get("/section", getSection);
router.get("/section/:Id", getSectionId);
router.post("/section", insertSection);
router.put("/section", updateSection);

//section end

//item class

router.get("/itemclass", getItemClass);
router.get("/itemclass/:Id", getItemClassId);
router.post("/itemclass", insertItemClass);
router.put("/itemclass", updateItemClass);

//item class end

//item category

router.get("/itemcategory", getItemCategory);
router.get("/itemcategory/:Id", getItemCategoryId);
router.post("/itemcategory", insertItemCategory);
router.put("/itemcategory", updateItemCategory);

//item category end

//unit

router.get("/itemunit", getItemUnit);
router.get("/itemunit/:Id", getItemUnitId);
router.post("/itemunit", insertItemUnit);
router.put("/itemunit", updateItemUnit);

//unit end

export default router;
