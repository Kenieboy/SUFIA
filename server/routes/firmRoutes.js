import express from "express";
import { dbConnection } from "../config/db.js";

const router = express.Router();

router.get("/", (req, res) => {
  const firmClassId = req.query.class; // Get the class query parameter
  let query = `SELECT * FROM FIRM`;

  // If class is specified, add WHERE clause to filter by FIRMCLASS
  if (firmClassId) {
    query += ` WHERE FIRMCLASSID = ? ORDER BY ID DESC`;
  }

  dbConnection.query(query, [firmClassId], (error, result) => {
    if (error) {
      console.error("Error fetching firms:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    res.json(result);
  });
});

router.post("/", (req, res) => {
  const { CODE, NAME, FIRMCLASSID /* other fields */ } = req.body;
  const query = `INSERT INTO FIRM (CODE, NAME, FIRMCLASSID /* other fields */) VALUES (?, ?, ? /* other values */)`;

  dbConnection.query(
    query,
    [CODE, NAME, FIRMCLASSID /* other values */],
    (error, result) => {
      if (error) {
        console.error("Error adding firm:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      res.json({ message: "Firm added successfully", Id: result.insertId });
    }
  );
});

export default router;
