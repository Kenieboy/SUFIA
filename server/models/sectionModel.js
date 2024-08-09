import { dbConnection } from "../config/db.js";

//select section
export const getSection = (req, res) => {
  const sectionSQL = `SELECT SECTION.ID, SECTION.CODE, SECTION.DESCRIPTION, DEPARTMENT.DESCRIPTION AS DEPARTMENT FROM SECTION
LEFT JOIN DEPARTMENT ON SECTION.DEPARTMENTID = DEPARTMENT.ID`;

  dbConnection.query(sectionSQL, (error, sectionSQLResult) => {
    if (error) throw new Error();

    res.json(sectionSQLResult);
  });
};

//insert section
export const insertSection = (req, res) => {
  const { DEPARTMENTID, CODE, DESCRIPTION } = req.body;

  const sectionSQL = `insert into SECTION(DEPARTMENTID, CODE, DESCRIPTION) VALUES(?,?,?)`;

  dbConnection.query(
    sectionSQL,
    [DEPARTMENTID, CODE, DESCRIPTION],
    (error, sectionSQLResult) => {
      if (error) throw new Error();

      res.status(200).json({ message: "Section successfully inserted!" });
    }
  );
};

//update section
export const updateSection = (req, res) => {
  const { ID, DEPARTMENTID, CODE, DESCRIPTION } = req.body;

  const sectionSQL = `UPDATE SECTION SET DEPARTMENTID = ?, CODE = ?, DESCRIPTION = ? WHERE ID = ?`;

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
  const sectionSQL = `SELECT SECTION.ID, SECTION.DEPARTMENTID, SECTION.CODE, SECTION.DESCRIPTION, DEPARTMENT.DESCRIPTION AS DEPARTMENT FROM SECTION
LEFT JOIN DEPARTMENT ON SECTION.ID = DEPARTMENT.ID WHERE SECTION.ID = ?`;

  dbConnection.query(sectionSQL, [Id], (error, sectionSQLResult) => {
    if (error) throw new Error();

    res.json(sectionSQLResult);
  });
};
