import express from "express";

import {
  getDeparment,
  getDepartmentId,
  insertDepartment,
  updateDepartment,
} from "../models/departmentModel.js";

import {
  getSection,
  getSectionId,
  insertSection,
  updateSection,
} from "../models/sectionModel.js";

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

export default router;
