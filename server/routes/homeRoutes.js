import express from "express";
import { dbConnection } from "../config/db.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Home Page!");
});

router.post("/", async (req, res) => {
  const { ITEMID, ITEMUNITID, VARIATIONS } = req.body;

  if (!ITEMID || !ITEMUNITID || !Array.isArray(VARIATIONS)) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  const q = `INSERT INTO ITEMVARIATION (ITEMID, ITEMUNITID, SPECIFICATIONS) VALUES (?,?,?)`;

  try {
    const insertPromises = VARIATIONS.map((item) => {
      return new Promise((resolve, reject) => {
        dbConnection.query(q, [ITEMID, ITEMUNITID, item], (error, result) => {
          if (error) {
            return reject(error);
          } else {
            return resolve(result);
          }
        });
      });
    });

    await Promise.all(insertPromises);
    res.status(200).json("All variations inserted successfully.");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
