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

  //   const query = `SELECT
  //     JSON_OBJECT(
  //         'sections', JSON_ARRAYAGG(
  //             JSON_OBJECT(
  //                 'SECTIONID', SECTION.ID,
  //                 'DESCRIPTION', SECTION.DESCRIPTION,
  //                 'ITEMS', (
  //                     SELECT JSON_ARRAYAGG(
  //                         JSON_OBJECT(
  //                            'SCDID', STANDARDCONSUMPTIONDETAIL.ID,
  //                             'ID', IM.ID,
  //                             'ITEMCODE', IM.CODE,
  //                             'NAMEENG', IM.NAMEENG,
  //                             'ITEMVARIATIONID', ITEMVARIATION.ID,
  //                             'QTY', STANDARDCONSUMPTIONDETAIL.QTY,
  //                             'CODE', ITEMUNIT.DESCRIPTIONEN
  //                         )
  //                     )
  //                     FROM STANDARDCONSUMPTIONDETAIL
  //                     LEFT JOIN ITEM ON ITEM.ID = STANDARDCONSUMPTIONDETAIL.PRODUCTITEMID
  //                     LEFT JOIN ITEMVARIATION ON ITEMVARIATION.ID = STANDARDCONSUMPTIONDETAIL.ITEMVARIATIONID
  //                     LEFT JOIN ITEMUNIT ON ITEMUNIT.ID = ITEMVARIATION.ITEMUNITID
  // 					LEFT JOIN ITEM AS IM ON IM.ID = ITEMVARIATION.ITEMID
  //                     WHERE STANDARDCONSUMPTIONDETAIL.SECTIONID = SECTION.ID
  //                     GROUP BY STANDARDCONSUMPTIONDETAIL.SECTIONID
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
  // GROUP BY
  //     STANDARDCONSUMPTION.PRODUCTITEMID

  // `;

  const query = `SELECT 
    JSON_OBJECT(
        'sections', JSON_ARRAYAGG(
            JSON_OBJECT(
                'SECTIONID', SECTION.ID,
                'DESCRIPTION', SECTION.DESCRIPTION,
                'ITEMS', (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                           'SCDID', STANDARDCONSUMPTIONDETAIL.ID,
                           'ID', IM.ID,
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
                )
            )
        ),
        'PRODUCTITEMID', STANDARDCONSUMPTION.PRODUCTITEMID,
        'PRODUCTNAME', PRODUCTITEM.NAMEENG,
        'SCID', STANDARDCONSUMPTION.ID
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
    STANDARDCONSUMPTION.PRODUCTITEMID, 
    STANDARDCONSUMPTION.ID,
    PRODUCTITEM.NAMEENG;`;

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
      SCID: data.SCID,
    });

    // "PRODUCTNAME": "PRODUCT 01",
    // "PRODUCTITEMID": 7255
  });
};

export const updateStandardConsumptionDetail = (req, res) => {
  const data = req.body;

  if (!data || !data.sections || !data.PRODUCTITEMID) {
    return res.status(400).send({ message: "Invalid data structure." });
  }

  const { sections, SCID } = data;

  sections.forEach((section) => {
    const { SECTIONID, ITEMS } = section;

    ITEMS.forEach((item) => {
      const { SCDID, QTY, ITEMVARIATIONID, MODE } = item;

      if (MODE === 1) {
        // Insert if MODE is 1
        dbConnection.query(
          `INSERT INTO STANDARDCONSUMPTIONDETAIL 
                  (STANDARDCONSUMPTIONID, SECTIONID, ITEMVARIATIONID, QTY) 
                  VALUES (?, ?, ?, ?)`,
          [SCID, SECTIONID, ITEMVARIATIONID, QTY],
          (insertErr) => {
            if (insertErr) {
              console.error("Error inserting into database:", insertErr);
              return res
                .status(500)
                .send({ message: "Database insert error." });
            }
          }
        );
      } else {
        // Check if the item already exists in the database
        dbConnection.query(
          `SELECT * FROM STANDARDCONSUMPTIONDETAIL WHERE ID = ?`,
          [SCDID],
          (err, results) => {
            if (err) {
              console.error("Error querying database:", err);
              return res.status(500).send({ message: "Database query error." });
            }

            if (results.length === 0) {
              // Insert if the record doesn't exist
              dbConnection.query(
                `INSERT INTO STANDARDCONSUMPTIONDETAIL 
                        (STANDARDCONSUMPTIONID, SECTIONID, ITEMVARIATIONID, QTY) 
                        VALUES (?, ?, ?, ?)`,
                [SCID, SECTIONID, ITEMVARIATIONID, QTY],
                (insertErr) => {
                  if (insertErr) {
                    console.error("Error inserting into database:", insertErr);
                    return res
                      .status(500)
                      .send({ message: "Database insert error." });
                  }
                }
              );
            } else {
              // Update the existing record
              dbConnection.query(
                `UPDATE STANDARDCONSUMPTIONDETAIL 
                        SET QTY = ? 
                        WHERE ID = ?`,
                [QTY, SCDID],
                (updateErr) => {
                  if (updateErr) {
                    console.error("Error updating database:", updateErr);
                    return res
                      .status(500)
                      .send({ message: "Database update error." });
                  }
                }
              );
            }
          }
        );
      }
    });
  });

  res
    .status(200)
    .send({ message: "Standard consumption details updated successfully." });
};

export const getDailyConsumptionData = (req, res) => {
  dbConnection.query(
    ` SELECT ITEM.NAMEENG, SECTION.DESCRIPTION, DAILYCONSUMPTION.* FROM DAILYCONSUMPTION 
left join ITEM on ITEM.id = DAILYCONSUMPTION.PRODUCTITEMID
left join SECTION ON SECTION.ID = DAILYCONSUMPTION.SECTIONID`,
    (err, results) => {
      if (err) {
        console.log("Database query error:", err);
        return res.status(500).json({ error: "Database query error" });
      }

      res.json(results);
    }
  );
};

export const getDailyConsumptionDataForUpdate = (req, res) => {
  const { productItemId } = req.params;

  //   const query = `SELECT
  //     JSON_OBJECT(
  //         'sections', JSON_ARRAYAGG(
  //             JSON_OBJECT(
  //                 'SECTIONID', SECTION.ID,
  //                 'DESCRIPTION', SECTION.DESCRIPTION,
  //                 'ITEMS', (
  //                     SELECT JSON_ARRAYAGG(
  //                         JSON_OBJECT(
  // 							'ID', PRODUCTITEM.ID,
  //                             'DCDID', dcd.ID,
  //                             'DAILYCONSUMPTIONID', dcd.DAILYCONSUMPTIONID,
  //                             'ITEMVARIATIONID', dcd.ITEMVARIATIONID,
  //                             'ACTUALQTY', dcd.ACTUALQTY
  //                         )
  //                     )
  //                     FROM (
  //                         SELECT DISTINCT ID, DAILYCONSUMPTIONID, ITEMVARIATIONID, ACTUALQTY
  //                         FROM DAILYCONSUMPTIONDETAIL
  //                         WHERE DAILYCONSUMPTIONDETAIL.DAILYCONSUMPTIONID = DAILYCONSUMPTION.ID
  //                           AND DAILYCONSUMPTIONDETAIL.DAILYCONSUMPTIONID IS NOT NULL
  //                     ) AS dcd
  //                 )
  //             )
  //         ),
  //         'PRODUCTITEMID', DAILYCONSUMPTION.PRODUCTITEMID,
  //         'PRODUCTNAME', PRODUCTITEM.NAMEENG,
  //         'DCID', DAILYCONSUMPTION.ID
  //     ) AS Result
  // FROM
  //     DAILYCONSUMPTION
  // LEFT JOIN
  //     SECTION ON SECTION.ID = DAILYCONSUMPTION.SECTIONID
  // LEFT JOIN
  //     ITEM AS PRODUCTITEM ON PRODUCTITEM.ID = DAILYCONSUMPTION.PRODUCTITEMID
  // WHERE
  //     DAILYCONSUMPTION.PRODUCTITEMID = ?
  // GROUP BY
  //     DAILYCONSUMPTION.PRODUCTITEMID,
  //     DAILYCONSUMPTION.ID,
  //     PRODUCTITEM.NAMEENG;`;

  const query = `SELECT 
    JSON_OBJECT(
        'sections', JSON_ARRAYAGG(
            JSON_OBJECT(
                'SECTIONID', SECTION.ID,
                'DESCRIPTION', SECTION.DESCRIPTION,
                'ITEMS', (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'ID', IM.ID,
                            'ITEMCODE', IM.CODE,
                            'NAMEENG', IM.NAMEENG,
                            'DCDID', dcd.ID,
                            'DAILYCONSUMPTIONID', dcd.DAILYCONSUMPTIONID,
                            'ITEMVARIATIONID', dcd.ITEMVARIATIONID,
                            'QTY', dcd.ACTUALQTY
                        )
                    )
                    FROM (
                        SELECT DISTINCT ID, DAILYCONSUMPTIONID, ITEMVARIATIONID, ACTUALQTY, SECTIONID
                        FROM DAILYCONSUMPTIONDETAIL
                        WHERE DAILYCONSUMPTIONDETAIL.DAILYCONSUMPTIONID = DAILYCONSUMPTION.ID
                          AND DAILYCONSUMPTIONDETAIL.DAILYCONSUMPTIONID IS NOT NULL
                    ) AS dcd
                    LEFT JOIN ITEMVARIATION IV ON IV.ID = dcd.ITEMVARIATIONID
                    LEFT JOIN ITEM IM ON IM.ID = IV.ITEMID
                )
            )
        ),
        'PRODUCTITEMID', DAILYCONSUMPTION.PRODUCTITEMID,
        'PRODUCTNAME', PRODUCTITEM.NAMEENG,
        'DCID', DAILYCONSUMPTION.ID
    ) AS Result
FROM 
    DAILYCONSUMPTION
LEFT JOIN 
    SECTION ON SECTION.ID = DAILYCONSUMPTION.SECTIONID
LEFT JOIN 
    ITEM AS PRODUCTITEM ON PRODUCTITEM.ID = DAILYCONSUMPTION.PRODUCTITEMID
WHERE 
    DAILYCONSUMPTION.PRODUCTITEMID = ?
GROUP BY 
    DAILYCONSUMPTION.PRODUCTITEMID, 
    DAILYCONSUMPTION.ID,
    PRODUCTITEM.NAMEENG;
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
      DCID: data.DCID,
    });

    // "PRODUCTNAME": "PRODUCT 01",
    // "PRODUCTITEMID": 7255
  });
};

export const updateDailyConsumptionDetail = (req, res) => {
  const data = req.body;

  if (!data || !data.sections || !data.PRODUCTITEMID) {
    return res.status(400).send({ message: "Invalid data structure." });
  }

  const { sections, DCID, PRODUCTITEMID } = data;

  dbConnection.query(
    `UPDATE DAILYCONSUMPTION SET PRODUCTITEMID = ? WHERE ID = ?`,
    [PRODUCTITEMID, DCID],
    (err) => {
      if (err) {
        console.error("Error updating DAILYCONSUMPTION:", err);
        return res
          .status(500)
          .send({ message: "Error updating DAILYCONSUMPTION." });
      }

      sections.forEach((section) => {
        const { SECTIONID, ITEMS } = section;

        ITEMS.forEach((item) => {
          const { DCDID, QTY, ITEMVARIATIONID, DAILYCONSUMPTIONID } = item;

          if (!DCDID) {
            dbConnection.query(
              `INSERT INTO DAILYCONSUMPTIONDETAIL 
                  (DAILYCONSUMPTIONID, SECTIONID, ITEMVARIATIONID, ACTUALQTY) 
                  VALUES (?, ?, ?, ?)`,
              [DAILYCONSUMPTIONID, SECTIONID, ITEMVARIATIONID, QTY],
              (insertErr) => {
                if (insertErr) {
                  console.error(
                    "Error inserting into DAILYCONSUMPTIONDETAIL:",
                    insertErr
                  );
                  return res.status(500).send({
                    message: "Error inserting DAILYCONSUMPTIONDETAIL.",
                  });
                }
              }
            );
          } else {
            dbConnection.query(
              `UPDATE DAILYCONSUMPTIONDETAIL 
                  SET ACTUALQTY = ?, ITEMVARIATIONID = ? 
                  WHERE ID = ?`,
              [QTY, ITEMVARIATIONID, DCDID],
              (updateErr) => {
                if (updateErr) {
                  console.error(
                    "Error updating DAILYCONSUMPTIONDETAIL:",
                    updateErr
                  );
                  return res.status(500).send({
                    message: "Error updating DAILYCONSUMPTIONDETAIL.",
                  });
                }
              }
            );
          }
        });
      });

      res
        .status(200)
        .send({ message: "Daily consumption details updated successfully." });
    }
  );
};

export const getItemDetailForMonthlyEntry = async (req, res) => {
  const itemId = req.params.id;

  const query = `
    SELECT ITEM.ID, ITEM.CODE, 
           ITEM.NAMEENG, 
           ITEMVARIATION.ID AS ITEMVARIATIONID, 
           ITEMVARIATION.ITEMUNITID, 
           ITEMUNIT.DESCRIPTIONEN AS ITEMUNITCODE, 
           ITEMVARIATION.FORPO, 
           ITEMVARIATION.FORSO, 
           1 AS QTY
    FROM ITEM
    LEFT JOIN ITEMVARIATION ON ITEMVARIATION.ITEMID = ITEM.ID
    LEFT JOIN ITEMUNIT ON ITEMUNIT.ID = ITEMVARIATION.ITEMUNITID
    WHERE ITEM.ID = ? AND ITEMVARIATION.FORPO = 1;
  `;

  try {
    const [rows] = await dbConnection.promise().query(query, [itemId]);

    const itemDetail = rows[0] || null;

    if (itemDetail) {
      res.json(itemDetail);
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  } catch (err) {
    console.error("Error fetching item details:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const insertProductionDetails = async (req, res) => {
//   const { date, productMemTable } = req.body;

//   // Step 1: Insert into the PRODUCTION table
//   const insertProductionQuery = `
//     INSERT INTO PRODUCTION (DATEPRODUCTION, USERID)
//     VALUES (?, ?);
//   `;

//   try {
//     // Inserting into PRODUCTION table
//     const [productionResult] = await dbConnection
//       .promise()
//       .query(insertProductionQuery, [date, 1]);

//     // Step 2: Retrieve the inserted PRODUCTIONID
//     const productionId = productionResult.insertId;

//     // Step 3: Insert into the PRODUCTIONDETAIL table for each item in productMemTable
//     const insertDetailPromises = productMemTable.map(async (item, index) => {
//       const { SOID, ID, ITEMVARIATIONID, QTY } = item;

//       // Line number is calculated based on the index (index + 1 because LINENO starts at 1)
//       const lineNo = index + 1;

//       const insertDetailQuery = `
//         INSERT INTO PRODUCTIONDETAIL (PRODUCTIONID, SOID, LINENO, ITEMID, ITEMVARIATIONID, QTY)
//         VALUES (?, ?, ?, ?, ?, ?);
//       `;

//       await dbConnection
//         .promise()
//         .query(insertDetailQuery, [
//           productionId,
//           SOID,
//           lineNo,
//           ID,
//           ITEMVARIATIONID,
//           QTY,
//         ]);
//     });

//     // Wait for all the promises to complete
//     await Promise.all(insertDetailPromises);

//     res
//       .status(200)
//       .json({ message: "Production and details inserted successfully" });
//   } catch (err) {
//     console.error("Error inserting production and details:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

export const insertProductionDetails = async (req, res) => {
  try {
    const { date, productMemTable } = req.body;

    // Validate input
    if (
      !date ||
      !Array.isArray(productMemTable) ||
      productMemTable.length === 0
    ) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    // Step 1: Insert into the PRODUCTION table
    const insertProductionQuery = `
      INSERT INTO PRODUCTION (DATEPRODUCTION, USERID)
      VALUES (?, ?);
    `;
    const [productionResult] = await dbConnection
      .promise()
      .query(insertProductionQuery, [date, 1]);

    // Step 2: Retrieve the inserted PRODUCTIONID
    const productionId = productionResult.insertId;

    // Step 3: Insert into the PRODUCTIONDETAIL table
    const insertDetailPromises = productMemTable.map((item, index) => {
      const { SOID = null, ID, ITEMVARIATIONID, QTY } = item;
      const lineNo = index + 1;

      const insertDetailQuery = `
        INSERT INTO PRODUCTIONDETAIL (PRODUCTIONID, SOID, LINENO, ITEMID, ITEMVARIATIONID, QTY)
        VALUES (?, ?, ?, ?, ?, ?);
      `;
      return dbConnection
        .promise()
        .query(insertDetailQuery, [
          productionId,
          SOID,
          lineNo,
          ID,
          ITEMVARIATIONID,
          QTY,
        ]);
    });

    await Promise.all(insertDetailPromises);

    res
      .status(200)
      .json({ message: "Production and details inserted successfully" });
  } catch (err) {
    console.error("Error inserting production and details:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMonthlyProductEntryData = (req, res) => {
  const SQL = `SELECT * FROM PRODUCTION;`;

  dbConnection.query(SQL, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error connecting to the database" });
    }

    return res.json(result);
  });
};

export const getProductionDetails = async (req, res) => {
  try {
    const productionId = req.params.productionId;

    // Validate input
    if (!productionId || isNaN(productionId)) {
      return res.status(400).json({ error: "Invalid production ID" });
    }

    const query = `
      SELECT IFNULL(JSON_ARRAYAGG(
        JSON_OBJECT(
          'CODE', ITEM.CODE,
          'NAMEENG', ITEM.NAMEENG,
          'ITEMUNITID', ITEMVARIATION.ITEMUNITID,
          'ITEMUNITCODE', ITEMUNIT.DESCRIPTIONEN,
          'ID', PRODUCTIONDETAIL.ID,
          'SOID', PRODUCTIONDETAIL.SOID,
          'LINENO', PRODUCTIONDETAIL.LINENO,
          'ITEMID', PRODUCTIONDETAIL.ITEMID,
          'ITEMVARIATIONID', PRODUCTIONDETAIL.ITEMVARIATIONID,
          'QTY', PRODUCTIONDETAIL.QTY
        )
      ), JSON_ARRAY()) AS result
      FROM PRODUCTION
      LEFT JOIN PRODUCTIONDETAIL ON PRODUCTIONDETAIL.PRODUCTIONID = PRODUCTION.ID
      LEFT JOIN ITEM ON ITEM.ID = PRODUCTIONDETAIL.ITEMID
      LEFT JOIN ITEMVARIATION ON ITEMVARIATION.ID = PRODUCTIONDETAIL.ITEMVARIATIONID
      LEFT JOIN ITEMUNIT ON ITEMUNIT.ID = ITEMVARIATION.ITEMUNITID
      WHERE PRODUCTION.ID = ?;
    `;

    const [rows] = await dbConnection.promise().query(query, [productionId]);

    // Extract the result
    const rawResult = rows[0]?.result;

    if (!rawResult) {
      return res.status(404).json({ error: "No production details found" });
    }

    // Ensure the result is a valid JSON string
    const parsedResult =
      typeof rawResult === "string" ? JSON.parse(rawResult) : rawResult;

    res.status(200).json(parsedResult); // Send parsed result as response
  } catch (err) {
    console.error("Error fetching production details:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateProductionDetail = (req, res) => {
  const { productionID, date, productMemTable } = req.body;

  // Update the PRODUCTION table
  const updateProductionQuery =
    "UPDATE PRODUCTION SET DATEPRODUCTION = ? WHERE ID = ?";
  dbConnection.query(
    updateProductionQuery,
    [date, productionID],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error updating production", error: err });
      }

      // Use a promise to ensure all product updates are completed before sending the response
      const updatePromises = productMemTable.map((product) => {
        const {
          ID,
          QTY,
          CODE,
          SOID,
          ITEMID,
          LINENO,
          ITEMUNITID,
          ITEMVARIATIONID,
        } = product;

        const updateDetailQuery = `
          UPDATE PRODUCTIONDETAIL 
          SET QTY = ?, SOID = ?, ITEMVARIATIONID = ? 
          WHERE ID = ? AND PRODUCTIONID = ?
        `;

        return new Promise((resolve, reject) => {
          dbConnection.query(
            updateDetailQuery,
            [QTY, SOID, ITEMVARIATIONID, ID, productionID],
            (err, result) => {
              if (err) {
                reject({
                  message: "Error updating production details",
                  error: err,
                });
              } else {
                resolve(result);
              }
            }
          );
        });
      });

      // Wait for all update queries to finish before sending a response
      Promise.all(updatePromises)
        .then(() => {
          res.status(200).json({
            message: "Production and production details updated successfully",
          });
        })
        .catch((error) => {
          res.status(500).json(error);
        });
    }
  );
};
