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

router.get("/pddItemVariation/:Id", (req, res) => {
  const { Id } = req.params;

  const purchaseDeliverySQL = `
    SELECT 
      ID AS PURCHASEDELIVERYID,
      PURCHASEDELIVERYNO, 
      SUPPLIERID, 
      DATEDELIVERED, 
      NOTE 
    FROM kis.PURCHASEDELIVERY 
    WHERE ID = ?`;

  const pddItemVariationSQL = `
    SELECT 
      PURCHASEDELIVERYDETAIL.ID,
      PURCHASEDELIVERYDETAIL.PURCHASEDELIVERYID,
      PURCHASEDELIVERYDETAIL.QTY, 
      PURCHASEDELIVERYDETAIL.PRICE, 
      PURCHASEDELIVERYDETAIL.AMOUNT, 
      ITEMVARIATION.SPECIFICATIONS, 
      ITEM.ID AS ITEMID,
      ITEMVARIATION.ID AS ITEMVARIATIONID,
      ITEMVARIATION.RATIO, 
      ITEM.CODE AS ITEMCODE,
      ITEM.NAMEENG, 
      ITEMUNIT.DESCRIPTIONEN AS CODE,
      IFNULL(
        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'ID', iv.ID,
              'ITEMUNITID', iv.ITEMUNITID,
              'ITEMUNITDESCRIPTION', iu.DESCRIPTIONEN,
              'SPECIFICATIONS', iv.SPECIFICATIONS,
              'COST', iv.COST,
              'PRICE', iv.PRICE,
              'FORPO', iv.FORPO,
              'RATIO', iv.RATIO
            )
          )
          FROM ITEMVARIATION iv
          LEFT JOIN ITEMUNIT iu ON iv.ITEMUNITID = iu.ID
          WHERE iv.ITEMID = ITEM.ID
        ),
        JSON_ARRAY()
      ) AS itemVariations
    FROM PURCHASEDELIVERYDETAIL
    LEFT JOIN ITEMVARIATION ON PURCHASEDELIVERYDETAIL.ITEMVARIATIONID = ITEMVARIATION.ID
    LEFT JOIN ITEMUNIT ON ITEMVARIATION.ITEMUNITID = ITEMUNIT.ID
    LEFT JOIN ITEM ON ITEMVARIATION.ITEMID = ITEM.ID
    LEFT JOIN PURCHASEDELIVERY ON PURCHASEDELIVERYDETAIL.PURCHASEDELIVERYID = PURCHASEDELIVERY.ID
    WHERE PURCHASEDELIVERYDETAIL.PURCHASEDELIVERYID = ?
    GROUP BY 
      PURCHASEDELIVERYDETAIL.ID,
      PURCHASEDELIVERYDETAIL.PURCHASEDELIVERYID,
      PURCHASEDELIVERYDETAIL.QTY, 
      PURCHASEDELIVERYDETAIL.PRICE, 
      PURCHASEDELIVERYDETAIL.AMOUNT, 
      ITEMVARIATION.SPECIFICATIONS, 
      ITEM.ID,
      ITEMVARIATION.ID,
      ITEMVARIATION.RATIO, 
      ITEM.CODE,
      ITEM.NAMEENG, 
      ITEMUNIT.DESCRIPTIONEN`;

  dbConnection.query(
    purchaseDeliverySQL,
    [Id],
    (error, purchaseDeliveryResult) => {
      if (error) {
        console.error("Error getting purchase delivery:", error);
        res
          .status(500)
          .json({ error: "Purchase Delivery Internal Server Error" });
        return;
      }

      dbConnection.query(
        pddItemVariationSQL,
        [Id],
        (error, pddItemVariationResult) => {
          if (error) {
            console.error("Error getting purchase delivery detail:", error);
            res.status(500).json({
              error: "Purchase Delivery Detail Internal Server Error",
            });
            return;
          }

          return res.json({
            purchaseDelivery: purchaseDeliveryResult,
            purchaseDeliveryDetail: pddItemVariationResult,
          });
        }
      );
    }
  );
});

export default router;
