import express from "express";
import { dbConnection } from "../config/db.js";
import { format as formatDate } from "date-fns";

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

    const newResult = result.map((item) => ({
      ...item,
      DATEDELIVERED: formatDate(new Date(item.DATEDELIVERED), "yyyy-MM-dd"),
    }));

    res.json(newResult);
  });
});

router.get("/withdrawalReport", (req, res) => {
  const withrdrawalReportSQL = `SELECT
      w.DATEREQUEST,
      w.REFNO,
      i.CODE AS ITEMCODE,
      i.NAMEENG AS MATERIALNAME,
      wd.QTY,
      iu.DESCRIPTIONEN AS UNIT
  FROM
      WITHDRAWALDETAIL wd
  LEFT JOIN
      WITHDRAWAL w ON w.ID = wd.WITHDRAWALID
  LEFT JOIN
      ITEMVARIATION iv ON wd.ITEMVARIATIONID = iv.ID
  LEFT JOIN
      ITEM i ON iv.ITEMID = i.ID
  LEFT JOIN
      ITEMUNIT iu ON iv.ITEMUNITID = iu.ID
  ORDER BY
      w.DATEREQUEST DESC;
  `;

  dbConnection.query(withrdrawalReportSQL, (error, result) => {
    if (error) {
      if (error) {
        console.error("Error getting withdrawaldetail:", error);
        res.status(500).json({ error: "WITHDRAWAL Internal Server Error" });
        return;
      }
    }

    const newResult = result.map((item) => ({
      ...item,
      DATEREQUEST: formatDate(new Date(item.DATEREQUEST), "yyyy-MM-dd"),
    }));

    res.json(newResult);
  });
});

export default router;
