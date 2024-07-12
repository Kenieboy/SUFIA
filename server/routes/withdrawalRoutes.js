import express from "express";
import { dbConnection } from "../config/db.js";

const router = express.Router();

// GET
router.get("/", (req, res) => {
  const sql = `SELECT WITHDRAWAL.ID, WITHDRAWAL.REFNO, WITHDRAWAL.DATEREQUEST, 
    WITHDRAWAL.PRODUCT, WITHDRAWAL.NOTE, WITHDRAWAL.RECEIVEDBY
    FROM WITHDRAWAL
    LEFT JOIN FIRM ON FIRM.ID = WITHDRAWAL.SUPPLIERID
    ORDER BY WITHDRAWAL.ID DESC
  `;

  dbConnection.query(sql, (error, result) => {
    if (error) {
      if (error) {
        console.error("Error getting purchasedelivery:", error);
        res.status(500).json({ error: "WITHDRAWAL Internal Server Error" });
        return;
      }
    }

    res.json(result);
  });
});

// POST
router.post("/", async (req, res) => {
  const {
    WITHDRAWALDETAIL,
    DEPARTMENTID,
    SECTIONID,
    RECEIVEBY,
    REFNO,
    DATEREQUEST,
    PRODUCT,
    ISSUEDBY,
  } = req.body;

  const withdrawalSQL = `INSERT INTO WITHDRAWAL 
                  (DEPARTMENTID, SECTIONID, RECEIVEDBY, REFNO, DATEREQUEST, PRODUCT, ISSUEDBY)
               VALUES 
                  (?, ?, ?, ?, ?, ?, ?)`;

  dbConnection.query(
    withdrawalSQL,
    [DEPARTMENTID, SECTIONID, RECEIVEBY, REFNO, DATEREQUEST, PRODUCT, ISSUEDBY],
    (error, result) => {
      const withdrawalId = result.insertId;

      if (WITHDRAWALDETAIL && WITHDRAWALDETAIL.length > 0) {
        const withdrawaDetailSQL = `INSERT INTO WITHDRAWALDETAIL (WITHDRAWALID, ITEMVARIATIONID, QTY)
                   VALUES (?, ?, ?)`;

        for (const detail of WITHDRAWALDETAIL) {
          const { ITEMVARIATIONID, QTY } = detail;
          dbConnection.query(withdrawaDetailSQL, [
            withdrawalId,
            ITEMVARIATIONID,
            QTY,
          ]);
        }
      }

      if (error) {
        res.status(500).json({ message: "Error creating withdrawal", error });
        return;
      }

      res
        .status(200)
        .json({ message: "Withdrawal created successfully", withdrawalId });
    }
  );
});

// GET DEPARTMENT & SECTION
router.get("/departments-sections", (req, res) => {
  const sqlDepartments = `SELECT ID, CODE, NAME, ISACTIVE FROM DEPARTMENT ORDER BY ID DESC`;
  const sqlSections = `SELECT ID, CODE, NAME, ISACTIVE FROM SECTION ORDER BY ID DESC`;

  dbConnection.query(sqlDepartments, (errorDepartments, resultDepartments) => {
    if (errorDepartments) {
      console.error("Error getting departments:", errorDepartments);
      res.status(500).json({ error: "DEPARTMENT Internal Server Error" });
      return;
    }

    dbConnection.query(sqlSections, (errorSections, resultSections) => {
      if (errorSections) {
        console.error("Error getting sections:", errorSections);
        res.status(500).json({ error: "SECTION Internal Server Error" });
        return;
      }

      res.json({ departments: resultDepartments, sections: resultSections });
    });
  });
});

export default router;
