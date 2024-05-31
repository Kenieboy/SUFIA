import express from "express";
import { dbConnection } from "../config/db.js";

const router = express.Router();

router.get("/", (req, res) => {
  const itemSQL = `SELECT * FROM ITEM ORDER BY ID DESC`;

  dbConnection.query(itemSQL, (err, result) => {
    if (err) {
      console.error("Error fetching items:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    return res.json(result);
  });
});

// fetch item variation data
router.get("/:id", (req, res) => {
  const { id } = req.params;

  // Ensure the id parameter is valid
  if (!id) {
    return res.status(400).json({ error: "Invalid ID parameter" });
  }

  const itemVariationSQL = `SELECT IV.ID, IV.SPECIFICATIONS, IV.NETWEIGHT, IV.GROSSWEIGHT, IV.VOLUME, IV.COST, IV.PRICE, IV.RATIO, 
  IV.ITEMUNITID, IU.DESCRIPTIONEN AS UNIT
  FROM ITEMVARIATION IV
  LEFT JOIN ITEMUNIT IU
  ON IV.ITEMUNITID = IU.ID
  WHERE IV.ITEMID=?`;

  dbConnection.query(itemVariationSQL, [id], (err, result) => {
    if (err) {
      console.error("Error fetching item variation:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Handle case where no item variation is found
    if (result.length === 0) {
      return res.status(404).json({ error: "Item Variation not found" });
    }

    res.json(result);
  });
});

// Route to insert data into ITEM table
router.post("/", (req, res) => {
  const {
    NAMEENG,
    NAMEJP,
    ITEMCLASSID,
    ITEMCATEGORYID,
    NOTE,
    DEFAULTCUSTOMERID,
    DEFAULTSUPPLIERID,
    itemVariation,
  } = req.body;

  const itemSQL = `INSERT INTO ITEM (NAMEENG, NAMEJP, ITEMCLASSID, ITEMCATEGORYID, NOTE, DEFAULTCUSTOMERID, DEFAULTSUPPLIERID) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  dbConnection.query(
    itemSQL,
    [
      NAMEENG,
      NAMEJP,
      ITEMCLASSID,
      ITEMCATEGORYID,
      NOTE,
      DEFAULTCUSTOMERID,
      DEFAULTSUPPLIERID,
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting items:", err);
        res.status(500).json({ error: "Items Internal Server Error" });
        return;
      }

      const lastInsertId = result.insertId;

      const formattedCode = `I000-${lastInsertId}`;

      const codeItemUpdateQuery = `UPDATE ITEM SET CODE=? WHERE ID=?`;

      dbConnection.query(codeItemUpdateQuery, [formattedCode, lastInsertId]);

      // Insert item variations if they exist
      if (itemVariation && itemVariation.length > 0) {
        const itemVariationSQL = `INSERT INTO ITEMVARIATION (ITEMID, ITEMUNITID, SPECIFICATIONS, NETWEIGHT, GROSSWEIGHT, VOLUME, COST, PRICE, RATIO) VALUES ?`;

        const itemVariationData = itemVariation.map(
          ({
            ITEMUNITID,
            SPECIFICATIONS,
            NETWEIGHT,
            GROSSWEIGHT,
            VOLUME,
            COST,
            PRICE,
            RATIO,
          }) => [
            lastInsertId,
            ITEMUNITID,
            SPECIFICATIONS,
            NETWEIGHT,
            GROSSWEIGHT,
            VOLUME,
            COST,
            PRICE,
            RATIO,
          ]
        );

        dbConnection.query(
          itemVariationSQL,
          [itemVariationData], // Note the use of a nested array
          (err, result) => {
            if (err) {
              console.error("Error inserting item variations:", err);
              res
                .status(500)
                .json({ error: "Item variation Internal Server Error" });
              return;
            }

            res.status(200).json({
              success: true,
              message: `Item and variations inserted successfully with Item ID #${lastInsertId}`,
            });
          }
        );
      } else {
        res.status(200).json({
          success: true,
          message: `Item inserted successfully with Item ID #${lastInsertId}`,
        });
      }
    }
  );
});

// item unit query

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

router.get("/metadata/:type", (req, res) => {
  const { type } = req.params;
  let table;

  switch (type) {
    case "itemclass":
      table = "ITEMCLASS";
      break;
    case "itemcategory":
      table = "ITEMCATEGORY";
      break;
    case "itemunit":
      table = "ITEMUNIT";
      break;
    default:
      return res.status(400).json({ error: "Invalid metadata type" });
  }

  const itemSQL = `SELECT * FROM ${table} WHERE ISACTIVE=1 ORDER BY CODE DESC`;

  dbConnection.query(itemSQL, (err, result) => {
    if (err) {
      console.error("Error fetching metadata:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    return res.json(result);
  });
});

export default router;
