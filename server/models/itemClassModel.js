import { dbConnection } from "../config/db.js";

//select item class
export const getItemClass = (req, res) => {
  const itemclassSQL = `select * from ITEMCLASS`;

  dbConnection.query(itemclassSQL, (error, itemclassSQLResult) => {
    if (error) throw new Error();

    res.json(itemclassSQLResult);
  });
};

//insert item class
export const insertItemClass = (req, res) => {
  const { CODE, DESCRIPTION } = req.body;

  const itemclassSQL = `insert into ITEMCLASS(CODE, DESCRIPTION) VALUES(?,?)`;

  dbConnection.query(
    itemclassSQL,
    [CODE, DESCRIPTION],
    (error, itemclassSQLResult) => {
      if (error) throw new Error();

      res.status(200).json({ message: "Item class successfully inserted!" });
    }
  );
};

//update item class
export const updateItemClass = (req, res) => {
  const { ID, CODE, DESCRIPTION } = req.body;

  const itemclassSQL = `UPDATE ITEMCLASS SET CODE = ?, DESCRIPTION = ? WHERE ID = ?`;

  dbConnection.query(
    itemclassSQL,
    [CODE, DESCRIPTION, ID],
    (error, itemclassSQLResult) => {
      if (error) throw new Error();

      res.status(200).json({ message: "Item class successfully updated!" });
    }
  );
};

export const getItemClassId = (req, res) => {
  const { Id } = req.params;
  const itemclassSQL = `select * from ITEMCLASS where ID=?`;

  dbConnection.query(itemclassSQL, [Id], (error, itemclassSQLResult) => {
    if (error) throw new Error();

    res.json(itemclassSQLResult);
  });
};
