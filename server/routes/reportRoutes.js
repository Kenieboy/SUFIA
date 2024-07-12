import express from "express";
import { dbConnection } from "../config/db.js";

const router = express.Router();

// GET
router.get("/", (req, res) => {
  const sql = `SELECT 
    pd.DATEDELIVERED,
    pd.PURCHASEDELIVERYNO,
    i.CODE AS ITEMCODE,
    i.NAMEENG AS MATERIALNAME,
    pdd.QTY,
    iu.DESCRIPTIONEN AS UNIT
FROM 
    PURCHASEDELIVERYDETAIL pdd
LEFT JOIN 
    PURCHASEDELIVERY pd ON pd.ID = pdd.PURCHASEDELIVERYID
LEFT JOIN 
    ITEMVARIATION iv ON pdd.ITEMVARIATIONID = iv.ID
LEFT JOIN 
    ITEM i ON iv.ITEMID = i.ID
LEFT JOIN 
    ITEMUNIT iu ON iv.ITEMUNITID = iu.ID
ORDER BY 
    pd.DATEDELIVERED DESC;


    `;

  dbConnection.query(sql, (error, result) => {
    if (error) {
      if (error) {
        console.error("Error getting purchasedelivery:", error);
        res.status(500).json({ error: "WITHDRAWAL Internal Server Error" });
        return;
      }
    }

    res.json(result);
  });
});

export default router;
