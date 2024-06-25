import express from "express";
import { dbConnection } from "../config/db.js";

const router = express.Router();

router.get("/", (req, res) => {
  const sql = `SELECT PURCHASEDELIVERY.ID, PURCHASEDELIVERY.PURCHASEDELIVERYNO, 
FIRM.NAME, PURCHASEDELIVERY.DATEDELIVERED, PURCHASEDELIVERY.NOTE, 
PURCHASEDELIVERY.TOTALAMOUNT, PURCHASEDELIVERY.GRANDTOTALAMOUNT 
FROM PURCHASEDELIVERY
LEFT JOIN FIRM ON FIRM.ID = PURCHASEDELIVERY.SUPPLIERID
ORDER BY PURCHASEDELIVERY.ID DESC

`;

  dbConnection.query(sql, (error, result) => {
    if (error) {
      if (error) {
        console.error("Error getting purchasedelivery:", error);
        res.status(500).json({ error: "PD Internal Server Error" });
        return;
      }
    }

    res.json(result);
  });
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

      if (PURCHASEDELIVERYDETAIL && PURCHASEDELIVERYDETAIL.length > 0) {
        const pddSQL = `INSERT INTO PURCHASEDELIVERYDETAIL (PURCHASEDELIVERYID, ITEMVARIATIONID, QTY, PRICE, AMOUNT) VALUES ?`;

        const purchaseDeliveryDetailData = PURCHASEDELIVERYDETAIL.map(
          ({ PURCHASEDELIVERYID, ITEMVARIATIONID, QTY, PRICE, AMOUNT }) => [
            lastInsertId,
            ITEMVARIATIONID,
            QTY,
            PRICE,
            AMOUNT,
          ]
        );

        dbConnection.query(
          pddSQL,
          [purchaseDeliveryDetailData],
          (error, result) => {
            if (error) {
              if (error) {
                console.error("Error inserting purchasedeliverydetail:", error);
                res.status(500).json({ error: "PDD Internal Server Error" });
                return;
              }
              res.status(200).json({
                success: true,
                message: `PDD inserted successfully`,
              });
            }
          }
        );
      }
      res.status(200).json({
        success: true,
        message: `PD inserted successfully with Item ID #:${lastInsertId}`,
      });
    }
  );
});

export default router;
