import { dbConnection } from "../config/db.js";

//select department
export const getDeparment = (req, res) => {
  const departmentSQL = `select * from department`;

  dbConnection.query(departmentSQL, (error, departmentSQLResult) => {
    if (error) throw new Error();

    res.json(departmentSQLResult);
  });
};

//insert department
export const insertDepartment = (req, res) => {
  const { CODE, DESCRIPTION } = req.body;

  const departmentSQL = `insert into DEPARTMENT(CODE, DESCRIPTION) VALUES(?,?)`;

  dbConnection.query(
    departmentSQL,
    [CODE, DESCRIPTION],
    (error, departmentSQLResult) => {
      if (error) throw new Error();

      res.status(200).json({ message: "Department successfully inserted!" });
    }
  );
};

//update department
export const updateDepartment = (req, res) => {
  const { ID, CODE, DESCRIPTION } = req.body;

  const departmentSQL = `UPDATE DEPARTMENT SET CODE = ?, DESCRIPTION = ? WHERE ID = ?`;

  dbConnection.query(
    departmentSQL,
    [CODE, DESCRIPTION, ID],
    (error, departmentSQLResult) => {
      if (error) throw new Error();

      res.status(200).json({ message: "Department successfully updated!" });
    }
  );
};

export const getDepartmentId = (req, res) => {
  const { Id } = req.params;
  const departmentSQL = `select * from department where ID=?`;

  dbConnection.query(departmentSQL, [Id], (error, departmentSQLResult) => {
    if (error) throw new Error();

    res.json(departmentSQLResult);
  });
};
