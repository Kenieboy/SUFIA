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
