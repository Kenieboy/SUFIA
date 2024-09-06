import express from "express";
import { dbConnection } from "../config/db.js";
import { login, logout, register } from "../models/authModel.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
