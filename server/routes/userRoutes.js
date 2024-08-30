import express from "express";
import { dbConnection } from "../config/db.js";
import { getUser } from "../models/userModel.js";

const router = express.Router();

router.get("/", getUser);

export default router;
