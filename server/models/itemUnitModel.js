import { dbConnection } from "../config/db.js";

//select item unit
export const getItemUnit = (req, res) => {
  const itemunitSQL = `select * from ITEMUNIT`;

  dbConnection.query(itemunitSQL, (error, itemUnitSQLResult) => {
    if (error) throw new Error();

    res.json(itemUnitSQLResult);
  });
};

//insert item unit
export const insertItemUnit = (req, res) => {
  const { CODE, DESCRIPTIONEN } = req.body;

  const itemunitSQL = `insert into ITEMUNIT( CODE, DESCRIPTIONEN) VALUES(?,?)`;

  dbConnection.query(
    itemunitSQL,
    [CODE, DESCRIPTIONEN],
    (error, itemUnitSQLResult) => {
      if (error) throw new Error();

      res.status(200).json({ message: "Item unit successfully inserted!" });
    }
  );
};

//update item unit
export const updateItemUnit = (req, res) => {
  const { ID, CODE, DESCRIPTIONEN } = req.body;

  const itemunitSQL = `UPDATE ITEMUNIT SET   CODE = ?, DESCRIPTIONEN = ? WHERE ID = ?`;

  dbConnection.query(
    itemunitSQL,
    [CODE, DESCRIPTIONEN, ID],
    (error, itemUnitSQLResult) => {
      if (error) throw new Error();

      res.status(200).json({ message: "Item unit successfully updated!" });
    }
  );
};

export const getItemUnitId = (req, res) => {
  const { Id } = req.params;
  const itemunitSQL = `select * from ITEMUNIT where ID=?`;

  dbConnection.query(itemunitSQL, [Id], (error, itemUnitSQLResult) => {
    if (error) throw new Error();

    res.json(itemUnitSQLResult);
  });
};
