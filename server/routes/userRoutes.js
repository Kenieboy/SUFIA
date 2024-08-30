import express from "express";
import { dbConnection } from "../config/db.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("users");
});

export default router;
