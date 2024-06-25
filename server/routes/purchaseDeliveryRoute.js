import express from "express";
import { dbConnection } from "../config/db.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("purchase delivery");
});

router.post("/", (req, res) => {
  const {
    PURCHASEDELIVERYNO,
    SUPPLIERID,
    DATEDELIVERED,
    NOTE,
    PURCHASEDELIVERYDETAIL,
  } = req.body;

  const pdSQL = `INSERT INTO PURCHASEDELIVERY (PURCHASEDELIVERYNO, SUPPLIERID, DATEDELIVERED, NOTE) VALUES (?,?,?,?)`;

  dbConnection.query(
    pdSQL,
    [PURCHASEDELIVERYNO, SUPPLIERID, DATEDELIVERED, NOTE],
    (error, result) => {
      if (error) {
        if (error) {
          console.error("Error inserting purchasedelivery:", error);
          res.status(500).json({ error: "PD Internal Server Error" });
          return;
        }
      }

      const lastInsertId = result.insertId;
      res.status(200).json({
        success: true,
        message: `PD inserted successfully with Item ID #:${lastInsertId}`,
      });
    }
  );
});

export default router;
