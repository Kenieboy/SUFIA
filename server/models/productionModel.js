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
  const sectionSQL = `SELECT * FROM STANDARDCONSUMPTIONSECTION`;

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
