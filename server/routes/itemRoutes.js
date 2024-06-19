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

  const itemVariationSQL = `SELECT IV.ID, IV.SPECIFICATIONS, IV.NETWEIGHT, IV.GROSSWEIGHT, IV.VOLUME, IV.COST, IV.PRICE, IV.RATIO, IV.FORSO, IV.FORPO, IV.FORPACKINGLIST, IV.FORINVOICE,
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

// insert item data & item variation
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
        const itemVariationSQL = `INSERT INTO ITEMVARIATION (ITEMID, ITEMUNITID, SPECIFICATIONS, NETWEIGHT, GROSSWEIGHT, VOLUME, COST, PRICE, RATIO, FORSO, FORPO, FORPACKINGLIST,  FORINVOICE) VALUES ?`;

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
            FORSO,
            FORPO,
            FORPACKINGLIST,
            FORINVOICE,
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
            FORSO,
            FORPO,
            FORPACKINGLIST,
            FORINVOICE,
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

// update item data & item variation

router.put("/", (req, res) => {
  const {
    ID: itemIdMain,
    NAMEENG,
    NAMEJP,
    NOTE,
    ITEMCLASSID,
    ITEMCATEGORYID,
    DEFAULTCUSTOMERID,
    DEFAULTSUPPLIERID,
    itemVariation,
  } = req.body;

  const updateItemSQL = `
    UPDATE ITEM
    SET NAMEENG = ?, NAMEJP = ?, NOTE = ?, ITEMCLASSID = ?, ITEMCATEGORYID = ?,
    DEFAULTCUSTOMERID = ?, DEFAULTSUPPLIERID = ?
    WHERE ID = ?
  `;

  dbConnection.query(
    updateItemSQL,
    [
      NAMEENG,
      NAMEJP,
      NOTE,
      ITEMCLASSID,
      ITEMCATEGORYID,
      DEFAULTCUSTOMERID,
      DEFAULTSUPPLIERID,
      itemIdMain,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating item:", err);
        return res
          .status(500)
          .json({ error: "Item Update Internal Server Error" });
      }

      // If there are item variations, update or insert them
      if (itemVariation && itemVariation.length > 0) {
        const promises = itemVariation.map((variation) => {
          return new Promise((resolve, reject) => {
            const {
              ID,
              ITEMUNITID,
              SPECIFICATIONS,
              NETWEIGHT,
              GROSSWEIGHT,
              VOLUME,
              COST,
              PRICE,
              RATIO,
              FORSO,
              FORPO,
              FORPACKINGLIST,
              FORINVOICE,
            } = variation;

            if (ID > 0) {
              // Update existing variation
              const updateVariationSQL = `
                UPDATE ITEMVARIATION
                SET ITEMUNITID = ?, SPECIFICATIONS = ?, NETWEIGHT = ?, GROSSWEIGHT = ?, VOLUME = ?, COST = ?, PRICE = ?, RATIO = ?, FORSO = ?, FORPO = ?, FORPACKINGLIST = ?, FORINVOICE = ?
                WHERE ID = ?
              `;
              dbConnection.query(
                updateVariationSQL,
                [
                  ITEMUNITID,
                  SPECIFICATIONS,
                  NETWEIGHT,
                  GROSSWEIGHT,
                  VOLUME,
                  COST,
                  PRICE,
                  RATIO,
                  FORSO,
                  FORPO,
                  FORPACKINGLIST,
                  FORINVOICE,
                  ID,
                ],
                (err) => {
                  if (err) {
                    console.error(
                      `Error updating item variation ID ${ID}:`,
                      err
                    );
                    reject(err);
                  } else {
                    resolve();
                  }
                }
              );
            } else {
              // Insert new variation
              const insertVariationSQL = `
                INSERT INTO ITEMVARIATION (
                  ITEMID, ITEMUNITID, SPECIFICATIONS, NETWEIGHT, GROSSWEIGHT, VOLUME, COST, PRICE, RATIO, FORSO, FORPO, FORPACKINGLIST, FORINVOICE
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `;
              dbConnection.query(
                insertVariationSQL,
                [
                  itemIdMain,
                  ITEMUNITID,
                  SPECIFICATIONS,
                  NETWEIGHT,
                  GROSSWEIGHT,
                  VOLUME,
                  COST,
                  PRICE,
                  RATIO,
                  FORSO,
                  FORPO,
                  FORPACKINGLIST,
                  FORINVOICE,
                ],
                (err) => {
                  if (err) {
                    console.error("Error inserting item variation:", err);
                    reject(err);
                  } else {
                    resolve();
                  }
                }
              );
            }
          });
        });

        Promise.all(promises)
          .then(() => {
            res.status(200).json({
              success: true,
              message: `Item and variations updated successfully with Item ID #${itemIdMain}`,
            });
          })
          .catch((err) => {
            res
              .status(500)
              .json({ error: "Item Variation Update Internal Server Error" });
          });
      } else {
        res.status(200).json({
          success: true,
          message: `Item updated successfully with Item ID #${itemIdMain}`,
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

//=============================== ITEM VARIATION =====================

router.delete("/itemvariation/:Id", (req, res) => {
  const { Id } = req.params;

  const itemVariationDeleteSQL = "DELETE FROM ITEMVARIATION WHERE ID=?";

  dbConnection.query(itemVariationDeleteSQL, [Id], (err, result) => {
    if (err) {
      console.error("Error deleting item variation", err);

      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    return res.json(result);
  });
});

//================================ ITEM DETAILS =======================

router.get("/itemdetail/:Id", (req, res) => {
  const { Id } = req.params;

  const q = `
    SELECT 
    i.ID AS ITEMID,
      i.CODE AS ITEMCODE, 
      i.NAMEENG, 
      i.NAMEJP, 
      IFNULL(
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'ID', iv.ID,
            'ITEMUNITID', iv.ITEMUNITID,
            'ITEMUNITDESCRIPTION', iu.DESCRIPTIONEN,
            'SPECIFICATIONS', iv.SPECIFICATIONS,
            'NETWEIGHT', iv.NETWEIGHT,
            'GROSSWEIGHT', iv.GROSSWEIGHT,
            'VOLUME', iv.VOLUME,
            'COST', iv.COST,
            'PRICE', iv.PRICE,
            'CUSTOMPRICE', iv.CUSTOMPRICE,
            'FORORDER', iv.FORORDER,
            'FORSTOCKING', iv.FORSTOCKING,
            'FORSELLING', iv.FORSELLING,
            'RATIO', iv.RATIO
          )
        ),
        JSON_ARRAY()
      ) AS itemVariations
    FROM 
      kis.ITEM i
    LEFT JOIN kis.ITEMVARIATION iv ON i.ID = iv.ITEMID
    LEFT JOIN kis.ITEMUNIT iu ON iv.ITEMUNITID = iu.ID
    WHERE i.ID = ?
    GROUP BY i.ID, i.CODE, i.NAMEENG, i.NAMEJP
  `;

  dbConnection.query(q, [Id], (error, result) => {
    if (error) {
      console.error("Database query error:", error);
      return res.status(500).json({ error: error.message });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Log the result to see what is being returned
    //console.log("Database query result:", result);

    // Transform the itemVariations string to a JSON array
    const transformedResult = result.map((row) => {
      try {
        // Check if itemVariations is null or empty, return an empty array if so
        const itemVariations =
          row.itemVariations && row.itemVariations.length > 0
            ? row.itemVariations
            : [];

        const QTY = 1;
        const CODE =
          itemVariations.length > 0
            ? itemVariations[0].ITEMUNITDESCRIPTION
            : ""; // Ensure there is at least one item variation
        const PRICE = itemVariations.length > 0 ? itemVariations[0].COST : 0; // Ensure there is at least one item variation
        const AMOUNT = QTY * PRICE;

        return {
          ...row,
          itemVariations: itemVariations,
          QTY,
          CODE,
          PRICE,
          AMOUNT,
        };
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.error("Offending JSON string:", row.itemVariations);
        return res.status(500).json({ error: "Error parsing item variations" });
      }
    });

    res.json(transformedResult[0]);
  });
});

export default router;
