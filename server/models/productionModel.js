import { dbConnection } from "../config/db.js";

export const getProduct = (req, res) => {
  const productSQL = `SELECT * FROM ITEM where ITEMCLASSID = 17`;

  dbConnection.query(productSQL, (err, result) => {
    if (err) {
      return res.status(403).json({ message: "Error connection" });
    }

    return res.json(result);
  });
};
