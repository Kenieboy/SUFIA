import express from "express";
import { dbConnection } from "../config/db.js";

const router = express.Router();

// fetching all firm data by firmClassId for 'customer' & 'supplier'

router.get("/", (req, res) => {
  const firmClassId = req.query.class;
  let query = `SELECT * FROM FIRM`;

  if (firmClassId) {
    query += ` WHERE FIRMCLASSID = ? ORDER BY ID DESC`;
  }

  dbConnection.query(query, [firmClassId], (error, result) => {
    if (error) {
      console.error("Error fetching firms:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    res.json(result);
  });
});

// inserting data to firm table

router.post("/", (req, res) => {
  const {
    NAME,
    FIRMCLASSID,
    CONTACTPERSON,
    DEPARTMENT,
    ADDRESS1,
    ADDRESS2,
    CITY,
    COUNTRY,
    ZIP,
    TELNO,
    FAXNO,
    EMAIL,
    REMARK /* other fields */,
  } = req.body;
  const query = `INSERT INTO FIRM (NAME, FIRMCLASSID, CONTACTPERSON,
    DEPARTMENT,
    ADDRESS1,
    ADDRESS2,
    CITY,
    COUNTRY,
    ZIP,
    TELNO,
    FAXNO,
    EMAIL,
    REMARK /* other fields */) VALUES (?, ?, ?,?,?,?,?,?,?,?,?,?,? /* other values */)`;

  dbConnection.query(
    query,
    [
      NAME,
      FIRMCLASSID,
      CONTACTPERSON,
      DEPARTMENT,
      ADDRESS1,
      ADDRESS2,
      CITY,
      COUNTRY,
      ZIP,
      TELNO,
      FAXNO,
      EMAIL,
      REMARK /* other values */,
    ],
    (error, result) => {
      const lastInsertId = result.insertId;

      const codeLables = {
        0: "A",
        1: "C",
        2: "S",
      };

      const formattedCode = `${codeLables[FIRMCLASSID]}000-${lastInsertId}`;

      const codeUpdateQuery = `UPDATE FIRM SET CODE=? WHERE ID=?`;

      dbConnection.query(codeUpdateQuery, [formattedCode, lastInsertId]);

      if (error) {
        console.error("Error adding firm:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      res.json({ message: "Firm added successfully", Id: result.insertId });
    }
  );
});

// updating data to firm table

router.put("/:id", (req, res) => {
  const firmId = req.params.id;
  const {
    NAME,
    FIRMCLASSID,
    CONTACTPERSON,
    DEPARTMENT,
    ADDRESS1,
    ADDRESS2,
    CITY,
    COUNTRY,
    ZIP,
    TELNO,
    FAXNO,
    EMAIL,
    REMARK /* other fields */,
  } = req.body;
  const query = `UPDATE FIRM SET NAME=?,
  FIRMCLASSID=?,
  CONTACTPERSON=?,
  DEPARTMENT=?,
  ADDRESS1=?,
  ADDRESS2=?,
  CITY=?,
  COUNTRY=?,
  ZIP=?,
  TELNO=?,
  FAXNO=?,
  EMAIL=?,
  REMARK=? /* other fields */ WHERE Id=?`;

  dbConnection.query(
    query,
    [
      NAME,
      FIRMCLASSID,
      CONTACTPERSON,
      DEPARTMENT,
      ADDRESS1,
      ADDRESS2,
      CITY,
      COUNTRY,
      ZIP,
      TELNO,
      FAXNO,
      EMAIL,
      REMARK /* other values */,
      firmId,
    ],
    (error, result) => {
      if (error) {
        console.error("Error updating firm:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (result.affectedRows === 0) {
        res.status(404).json({ error: "Firm not found" });
        return;
      }

      res.json({ message: "Firm updated successfully", Id: firmId });
    }
  );
});

export default router;
