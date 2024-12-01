import { dbConnection } from "../config/db.js";

export const getProduct = (req, res) => {
  const productSQL = `SELECT * FROM ITEM WHERE ITEMCLASSID = ?`;
  const itemClassId = 17; // Keeping the static value for now

  dbConnection.query(productSQL, [itemClassId], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error connecting to the database" });
    }

    return res.json(result);
  });
};

//production section area

//select section
export const getSection = (req, res) => {
  const sectionSQL = `SELECT SECTION.ID, SECTION.CODE, SECTION.DESCRIPTION, DEPARTMENT.DESCRIPTION AS DEPARTMENT FROM SECTION
LEFT JOIN DEPARTMENT ON DEPARTMENT.ID = SECTION.DEPARTMENTID`;

  dbConnection.query(sectionSQL, (error, sectionSQLResult) => {
    if (error) throw new Error();

    res.json(sectionSQLResult);
  });
};

//insert section
export const insertSection = (req, res) => {
  const { CODE, DESCRIPTION } = req.body;

  const checkDescriptionSQL = `SELECT * FROM STANDARDCONSUMPTIONSECTION WHERE DESCRIPTION = ?`;

  dbConnection.query(checkDescriptionSQL, [DESCRIPTION], (error, result) => {
    if (error) throw new Error();

    if (result.length > 0) {
      return res.status(400).json({ message: "Description already exists!" });
    } else {
      const sectionSQL = `INSERT INTO STANDARDCONSUMPTIONSECTION (CODE, DESCRIPTION) VALUES (?, ?)`;

      dbConnection.query(
        sectionSQL,
        [CODE, DESCRIPTION],
        (error, sectionSQLResult) => {
          if (error) throw new Error();

          res.status(200).json({ message: "Section successfully inserted!" });
        }
      );
    }
  });
};

//update section
export const updateSection = (req, res) => {
  const { ID, DEPARTMENTID, CODE, DESCRIPTION } = req.body;

  const sectionSQL = `UPDATE STANDARDCONSUMPTIONSECTION SET DEPARTMENTID = ?, CODE = ?, DESCRIPTION = ? WHERE ID = ?`;

  dbConnection.query(
    sectionSQL,
    [DEPARTMENTID, CODE, DESCRIPTION, ID],
    (error, sectionSQLResult) => {
      if (error) throw new Error();

      res.status(200).json({ message: "Section successfully updated!" });
    }
  );
};

export const getSectionId = (req, res) => {
  const { Id } = req.params;
  const sectionSQL = `SELECT STANDARDCONSUMPTIONSECTION.ID, STANDARDCONSUMPTIONSECTION.DEPARTMENTID, STANDARDCONSUMPTIONSECTION.CODE, STANDARDCONSUMPTIONSECTION.DESCRIPTION, DEPARTMENT.DESCRIPTION AS DEPARTMENT FROM STANDARDCONSUMPTIONSECTION
LEFT JOIN DEPARTMENT ON STANDARDCONSUMPTIONSECTION.ID = DEPARTMENT.ID WHERE STANDARDCONSUMPTIONSECTION.ID = ?`;

  dbConnection.query(sectionSQL, [Id], (error, sectionSQLResult) => {
    if (error) throw new Error();

    res.json(sectionSQLResult);
  });
};

export const insertStandardConsumption = (req, res) => {
  const { sections, PRODUCTITEMID } = req.body;

  const sql = `INSERT INTO STANDARDCONSUMPTION (REFNO, PRODUCTITEMID, DATE, NOTE, INPUTBY) 
               VALUES (?, ?, NOW(), ?, ?)`;

  dbConnection.query(
    sql,
    ["kenneth", PRODUCTITEMID, "kenneth", "kenneth"],
    (err, result) => {
      if (err) {
        return res.status(404).json({ message: "Error inserting data." });
      }

      const standardConsumptionId = result.insertId;
      let queriesCompleted = 0; // Track completed queries
      const totalQueries = sections.reduce(
        (acc, section) => acc + section.ITEMS.length,
        0
      );

      for (const section of sections) {
        for (const item of section.ITEMS) {
          dbConnection.query(
            `INSERT INTO STANDARDCONSUMPTIONDETAIL (STANDARDCONSUMPTIONID, SECTIONID, ITEMVARIATIONID, QTY) 
             VALUES (?, ?, ?, ?)`,
            [
              standardConsumptionId,
              section.SECTIONID,
              item.ITEMVARIATIONID,
              item.QTY,
            ],
            (err) => {
              if (err) {
                return res
                  .status(500)
                  .json({ message: "Error inserting details." });
              }

              // Increment completed queries counter
              queriesCompleted += 1;

              // If all queries are completed, send the response
              if (queriesCompleted === totalQueries) {
                res.status(201).json({ message: "Data inserted successfully" });
              }
            }
          );
        }
      }
    }
  );
};

export const requestStandartConsumptionDetail = (req, res) => {
  // Extract query parameters
  const { productItemId, sectionId } = req.query;

  // Validate query parameters
  if (!productItemId || !sectionId) {
    return res.status(400).json({
      error: "Missing required query parameters: productItemId, sectionId",
    });
  }

  // SQL query
  const query = `
        SELECT
            STANDARDCONSUMPTION.PRODUCTITEMID,
            ITEM.CODE,
            ITEM.NAMEENG,
            ITEMUNIT.DESCRIPTIONEN AS UNITDESCRIPTION,
            SECTION.DESCRIPTION,
            STANDARDCONSUMPTIONDETAIL.*
        FROM STANDARDCONSUMPTIONDETAIL
        LEFT JOIN STANDARDCONSUMPTION ON STANDARDCONSUMPTIONDETAIL.STANDARDCONSUMPTIONID = STANDARDCONSUMPTION.ID
        LEFT JOIN SECTION ON SECTION.ID = STANDARDCONSUMPTIONDETAIL.SECTIONID
        LEFT JOIN ITEMVARIATION ON ITEMVARIATION.ID = STANDARDCONSUMPTIONDETAIL.ITEMVARIATIONID
        LEFT JOIN ITEM ON ITEM.ID = ITEMVARIATION.ITEMID
        LEFT JOIN ITEMUNIT ON ITEMUNIT.ID = ITEMVARIATION.ITEMUNITID
        WHERE STANDARDCONSUMPTION.PRODUCTITEMID = ? AND STANDARDCONSUMPTIONDETAIL.SECTIONID = ?;
    `;

  // Execute query
  dbConnection.query(query, [productItemId, sectionId], (error, results) => {
    if (error) {
      console.error("Error fetching standard consumption details:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching the data." });
    }

    // Return results (empty array if no data)
    res.json(results.length ? results : []);
  });
};

export const insertDailyConsumptionData = (req, res) => {
  const { PRODUCTID, SECTIONID, ITEMS } = req.body;

  if (!PRODUCTID || !SECTIONID || !Array.isArray(ITEMS) || ITEMS.length === 0) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  dbConnection.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ error: "Database connection failed" });
    }

    // Start a transaction
    connection.beginTransaction((transactionErr) => {
      if (transactionErr) {
        connection.release();
        console.error("Transaction start failed:", transactionErr);
        return res.status(500).json({ error: "Transaction failed to start" });
      }

      // Insert into DAILYCONSUMPTION
      const insertDailyConsumptionQuery = `
        INSERT INTO DAILYCONSUMPTION (REFNO, PRODUCTITEMID, SECTIONID, DATE, NOTE, INPUTBY)
        VALUES (?, ?, ?, CURDATE(), NULL, 'SYSTEM')
      `;

      connection.query(
        insertDailyConsumptionQuery,
        [null, PRODUCTID, SECTIONID],
        (insertErr, result) => {
          if (insertErr) {
            connection.rollback(() => connection.release());
            console.error("Error inserting into DAILYCONSUMPTION:", insertErr);
            return res
              .status(500)
              .json({ error: "Failed to record daily consumption" });
          }

          const DAILYCONSUMPTIONID = result.insertId;

          // Prepare data for DAILYCONSUMPTIONDETAIL
          const detailsData = ITEMS.map((item) => [
            DAILYCONSUMPTIONID,
            item.ITEMVARIATIONID,
            item.QTY,
          ]);

          // Insert into DAILYCONSUMPTIONDETAIL
          const insertDetailsQuery = `
            INSERT INTO DAILYCONSUMPTIONDETAIL (DAILYCONSUMPTIONID, ITEMVARIATIONID, ACTUALQTY)
            VALUES ?
          `;

          connection.query(insertDetailsQuery, [detailsData], (detailsErr) => {
            if (detailsErr) {
              connection.rollback(() => connection.release());
              console.error(
                "Error inserting into DAILYCONSUMPTIONDETAIL:",
                detailsErr
              );
              return res
                .status(500)
                .json({ error: "Failed to record daily consumption details" });
            }

            // Commit transaction
            connection.commit((commitErr) => {
              if (commitErr) {
                connection.rollback(() => connection.release());
                console.error("Error committing transaction:", commitErr);
                return res
                  .status(500)
                  .json({ error: "Transaction commit failed" });
              }

              connection.release();
              res.status(201).json({
                message: "Daily consumption recorded successfully",
                DAILYCONSUMPTIONID,
              });
            });
          });
        }
      );
    });
  });
};

export const getStandardConsumptionData = (req, res) => {
  dbConnection.query(
    "SELECT ITEM.NAMEENG, STANDARDCONSUMPTION.* FROM STANDARDCONSUMPTION left join ITEM on ITEM.id = STANDARDCONSUMPTION.PRODUCTITEMID",
    (err, results) => {
      if (err) {
        console.log("Database query error:", err);
        return res.status(500).json({ error: "Database query error" });
      }

      res.json(results);
    }
  );
};

export const getStandardConsumptionDataForUpdate = (req, res) => {
  const { productItemId } = req.params;

  //   const query = `
  //     SELECT
  //     JSON_OBJECT(
  //         'sections', JSON_ARRAYAGG(
  //             JSON_OBJECT(
  //                 'SECTIONID', SECTION.ID,
  //                 'DESCRIPTION', SECTION.DESCRIPTION,
  //                 'ITEMS', (
  //                     SELECT JSON_ARRAYAGG(
  //                         JSON_OBJECT(
  //                             'ID', ITEMVARIATION.ID,
  //                             'ITEMCODE', ITEM.CODE,
  //                             'NAMEENG', ITEM.NAMEENG,
  //                             'NAMEJP', ITEM.NAMEJP,
  //                             'ITEMVARIATIONID', ITEMVARIATION.ID,
  //                             'QTY', STANDARDCONSUMPTIONDETAIL.QTY,
  //                             'CODE', ITEMUNIT.CODE
  //                         )
  //                     )
  //                     FROM STANDARDCONSUMPTIONDETAIL
  //                     LEFT JOIN ITEM ON ITEM.ID = STANDARDCONSUMPTIONDETAIL.PRODUCTITEMID
  //                     LEFT JOIN ITEMVARIATION ON ITEMVARIATION.ID = STANDARDCONSUMPTIONDETAIL.ITEMVARIATIONID
  //                     LEFT JOIN ITEMUNIT ON ITEMUNIT.ID = ITEMVARIATION.ITEMUNITID
  //                     WHERE STANDARDCONSUMPTIONDETAIL.SECTIONID = SECTION.ID
  //                 )
  //             )
  //         ),
  //         'PRODUCTITEMID', STANDARDCONSUMPTION.PRODUCTITEMID,
  //         'PRODUCTNAME', PRODUCTITEM.NAMEENG
  //     ) AS Result
  // FROM
  //     STANDARDCONSUMPTION
  // LEFT JOIN
  //     STANDARDCONSUMPTIONDETAIL ON STANDARDCONSUMPTION.ID = STANDARDCONSUMPTIONDETAIL.STANDARDCONSUMPTIONID
  // LEFT JOIN
  //     SECTION ON SECTION.ID = STANDARDCONSUMPTIONDETAIL.SECTIONID
  // LEFT JOIN
  //     ITEM AS PRODUCTITEM ON PRODUCTITEM.ID = STANDARDCONSUMPTION.PRODUCTITEMID
  // WHERE
  //     STANDARDCONSUMPTION.PRODUCTITEMID = ?
  //     GROUP BY
  //     STANDARDCONSUMPTIONDETAIL.SECTIONID, SECTION.ID
  //   `;

  const query = `SELECT 
    JSON_OBJECT(
        'sections', JSON_ARRAYAGG(
            JSON_OBJECT(
                'SECTIONID', SECTION.ID,
                'DESCRIPTION', SECTION.DESCRIPTION,
                'ITEMS', (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'ID', ITEMVARIATION.ID,
                            'ITEMCODE', IM.CODE,
                            'NAMEENG', IM.NAMEENG,
                            'ITEMVARIATIONID', ITEMVARIATION.ID,
                            'QTY', STANDARDCONSUMPTIONDETAIL.QTY,
                            'CODE', ITEMUNIT.DESCRIPTIONEN
                        )
                    )
                    FROM STANDARDCONSUMPTIONDETAIL
                    LEFT JOIN ITEM ON ITEM.ID = STANDARDCONSUMPTIONDETAIL.PRODUCTITEMID
                    LEFT JOIN ITEMVARIATION ON ITEMVARIATION.ID = STANDARDCONSUMPTIONDETAIL.ITEMVARIATIONID
                    LEFT JOIN ITEMUNIT ON ITEMUNIT.ID = ITEMVARIATION.ITEMUNITID
					LEFT JOIN ITEM AS IM ON IM.ID = ITEMVARIATION.ITEMID
                    WHERE STANDARDCONSUMPTIONDETAIL.SECTIONID = SECTION.ID
                    GROUP BY STANDARDCONSUMPTIONDETAIL.SECTIONID 
                )
            )
        ),
        'PRODUCTITEMID', STANDARDCONSUMPTION.PRODUCTITEMID,
        'PRODUCTNAME', PRODUCTITEM.NAMEENG
    ) AS Result
FROM 
    STANDARDCONSUMPTION
LEFT JOIN 
    STANDARDCONSUMPTIONDETAIL ON STANDARDCONSUMPTION.ID = STANDARDCONSUMPTIONDETAIL.STANDARDCONSUMPTIONID
LEFT JOIN 
    SECTION ON SECTION.ID = STANDARDCONSUMPTIONDETAIL.SECTIONID
LEFT JOIN 
    ITEM AS PRODUCTITEM ON PRODUCTITEM.ID = STANDARDCONSUMPTION.PRODUCTITEMID
WHERE 
    STANDARDCONSUMPTION.PRODUCTITEMID = ?
GROUP BY 
    STANDARDCONSUMPTION.PRODUCTITEMID

`;

  dbConnection.query(query, [productItemId], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Database query error" });
    }

    const data = results[0].Result;

    const seenSectionIDs = new Set();

    data.sections = data.sections.filter((section) => {
      if (seenSectionIDs.has(section.SECTIONID)) {
        return false;
      } else {
        seenSectionIDs.add(section.SECTIONID);
        return true;
      }
    });

    res.json({
      sections: data.sections,
      PRODUCTITEMID: data.PRODUCTITEMID,
      PRODUCTNAME: data.PRODUCTNAME,
    });

    // "PRODUCTNAME": "PRODUCT 01",
    // "PRODUCTITEMID": 7255
  });
};
