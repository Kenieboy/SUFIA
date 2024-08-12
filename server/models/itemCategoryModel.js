import { dbConnection } from "../config/db.js";

//select item category
export const getItemCategory = (req, res) => {
  const itemcategorySQL = `select ICAT.ID, ICAT.CLASSID, ICAT.CODE, ICAT. DESCRIPTION, ICLASS.DESCRIPTION AS CLASS from ITEMCATEGORY ICAT
left join ITEMCLASS ICLASS ON ICLASS.ID = ICAT.CLASSID`;

  dbConnection.query(itemcategorySQL, (error, itemcategorySQLResult) => {
    if (error) throw new Error();

    res.json(itemcategorySQLResult);
  });
};

//insert item category
export const insertItemCategory = (req, res) => {
  const { CLASSID, CODE, DESCRIPTION } = req.body;

  const itemcategorySQL = `insert into ITEMCATEGORY(CLASSID ,CODE, DESCRIPTION) VALUES(?,?,?)`;

  dbConnection.query(
    itemcategorySQL,
    [CLASSID, CODE, DESCRIPTION],
    (error, itemcategorySQLResult) => {
      if (error) throw new Error();

      res.status(200).json({ message: "Item category successfully inserted!" });
    }
  );
};

//update item category
export const updateItemCategory = (req, res) => {
  const { ID, CLASSID, CODE, DESCRIPTION } = req.body;

  const itemcategorySQL = `UPDATE ITEMCATEGORY SET CLASSID = ?, CODE = ?, DESCRIPTION = ? WHERE ID = ?`;

  dbConnection.query(
    itemcategorySQL,
    [CLASSID, CODE, DESCRIPTION, ID],
    (error, itemcategorySQLResult) => {
      if (error) throw new Error();

      res.status(200).json({ message: "Item category successfully updated!" });
    }
  );
};

export const getItemCategoryId = (req, res) => {
  const { Id } = req.params;
  const itemcategorySQL = `select * from ITEMCATEGORY where ID=?`;

  dbConnection.query(itemcategorySQL, [Id], (error, itemcategorySQLResult) => {
    if (error) throw new Error();

    res.json(itemcategorySQLResult);
  });
};
