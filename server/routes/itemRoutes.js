import express from "express";
import { dbConnection } from "../config/db.js";

const router = express.Router();

router.get("/", (req, res) => {
  const itemSQL = `SELECT * FROM ITEM ORDER BY CODE DESC`;

  dbConnection.query(itemSQL, (err, result) => {
    if (err) {
      console.error("Error fetching items:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    return res.json(result);
  });
});

router.get("/itemclass", (req, res) => {
  const itemSQL = `SELECT * FROM ITEMCLASS WHERE ISACTIVE=1 ORDER BY CODE DESC`;

  dbConnection.query(itemSQL, (err, result) => {
    if (err) {
      console.error("Error fetching items:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    return res.json(result);
  });
});

router.get("/itemunit", (req, res) => {
  const itemSQL = `SELECT * FROM ITEMUNIT WHERE ISACTIVE=1 ORDER BY CODE DESC`;

  dbConnection.query(itemSQL, (err, result) => {
    if (err) {
      console.error("Error fetching items:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    return res.json(result);
  });
});

export default router;
