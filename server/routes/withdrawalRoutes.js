import express from "express";
import { dbConnection } from "../config/db.js";
import { format as formatDate } from "date-fns";

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

// GET INDIVIDUAL WITHDRAWAL DATA
router.get("/withdrawalDetail/:Id", (req, res) => {
  const { Id } = req.params;

  const withdrawalSQL = `SELECT W.ID AS WITHDRAWALID, W.DEPARTMENTID, W.SECTIONID, W.RECEIVEDBY,
  W.REFNO, W.DATEREQUEST, W.PRODUCT, W.ISSUEDBY, D.NAME AS DEPARTMENT, S.NAME AS SECTION
   FROM kis.WITHDRAWAL W
   LEFT JOIN DEPARTMENT D ON D.ID = W.DEPARTMENTID
   LEFT JOIN SECTION S ON S.ID = W.SECTIONID
   WHERE W.ID=?`;

  const withdrawalDetailSQL = `SELECT 
    WITHDRAWALDETAIL.ID AS WITHDRAWALDETAILID,
    WITHDRAWALDETAIL.WITHDRAWALID,
    WITHDRAWALDETAIL.ITEMVARIATIONID,
    WITHDRAWALDETAIL.QTY,
    ITEMVARIATION.SPECIFICATIONS,
    ITEM.ID AS ITEMID,
    ITEMVARIATION.ID AS ITEMVARIATIONID,
    ITEMVARIATION.RATIO,
    ITEM.CODE AS ITEMCODE,
    ITEM.NAMEENG,
    ITEMUNIT.DESCRIPTIONEN AS CODE,
    IFNULL(
        (
            SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'ID', iv.ID,
                    'ITEMUNITID', iv.ITEMUNITID,
                    'ITEMUNITDESCRIPTION', iu.DESCRIPTIONEN,
                    'SPECIFICATIONS', iv.SPECIFICATIONS,
                    'COST', iv.COST,
                    'PRICE', iv.PRICE,
                    'FORPO', iv.FORPO,
                    'RATIO', iv.RATIO
                )
            )
            FROM ITEMVARIATION iv
            LEFT JOIN ITEMUNIT iu ON iv.ITEMUNITID = iu.ID
            WHERE iv.ITEMID = ITEM.ID
        ),
        JSON_ARRAY()
    ) AS withdrawalDetail
FROM WITHDRAWALDETAIL
LEFT JOIN ITEMVARIATION ON WITHDRAWALDETAIL.ITEMVARIATIONID = ITEMVARIATION.ID
LEFT JOIN ITEMUNIT ON ITEMVARIATION.ITEMUNITID = ITEMUNIT.ID
LEFT JOIN ITEM ON ITEMVARIATION.ITEMID = ITEM.ID
WHERE WITHDRAWALDETAIL.WITHDRAWALID = ?
GROUP BY 
    WITHDRAWALDETAIL.ID,
    WITHDRAWALDETAIL.WITHDRAWALID,
    WITHDRAWALDETAIL.ITEMVARIATIONID,
    WITHDRAWALDETAIL.QTY,
    ITEMVARIATION.SPECIFICATIONS,
    ITEM.ID,
    ITEMVARIATION.ID,
    ITEMVARIATION.RATIO,
    ITEM.CODE,
    ITEM.NAMEENG,
    ITEMUNIT.DESCRIPTIONEN;
`;

  dbConnection.query(withdrawalSQL, [Id], (error, withdrawalResult) => {
    if (error) {
      console.error("Error getting withdrawal:", error);
      res.status(500).json({ error: "Withdrawal Internal Server Error" });
      return;
    }

    dbConnection.query(
      withdrawalDetailSQL,
      [Id],
      (error, withdrawalDetailResult) => {
        if (error) {
          console.error("Error getting withdrawal detail:", error);
          res.status(500).json({
            error: "Withdrawal Detail Internal Server Error",
          });
          return;
        }

        const { DATEREQUEST, ...others } = withdrawalResult[0];

        const formattedDate = formatDate(DATEREQUEST, "yyyy-MM-dd");

        const newWithdrawalResult = { ...others, DATEREQUEST: formattedDate };

        return res.json({
          withdrawal: newWithdrawalResult,
          withdrawalDetail: withdrawalDetailResult,
        });
      }
    );
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

// UPDATE OR PUT
router.put("/", async (req, res) => {
  const {
    WITHDRAWALID,
    DEPARTMENTID,
    SECTIONID,
    RECEIVEBY,
    REFNO,
    DATEREQUEST,
    PRODUCT,
    ISSUEDBY,
    WITHDRAWALDETAIL,
  } = req.body;

  // Update WITHDRAWAL
  const updateWithdrawalSQL = `UPDATE WITHDRAWAL SET DEPARTMENTID = ?, SECTIONID = ?, RECEIVEDBY = ?, REFNO = ?, DATEREQUEST = ?, PRODUCT = ?, ISSUEDBY = ? WHERE ID = ?`;

  dbConnection.query(
    updateWithdrawalSQL,
    [
      DEPARTMENTID,
      SECTIONID,
      RECEIVEBY,
      REFNO,
      DATEREQUEST,
      PRODUCT,
      ISSUEDBY,
      WITHDRAWALID,
    ],
    (error, result) => {
      if (error) {
        res.status(500).json({ message: "Error updating withdrawal", error });
        return;
      }

      // Process WITHDRAWALDETAIL updates or inserts
      if (WITHDRAWALDETAIL && WITHDRAWALDETAIL.length > 0) {
        for (const detail of WITHDRAWALDETAIL) {
          const { WITHDRAWALDETAILID, ITEMVARIATIONID, QTY } = detail;

          if (WITHDRAWALDETAILID < 0) {
            // Insert new record into WITHDRAWALDETAIL if WITHDRAWALDETAILID is negative
            const insertDetailSQL = `INSERT INTO WITHDRAWALDETAIL (WITHDRAWALID, ITEMVARIATIONID, QTY) VALUES (?, ?, ?)`;

            dbConnection.query(
              insertDetailSQL,
              [WITHDRAWALID, ITEMVARIATIONID, QTY],
              (error, result) => {
                if (error) {
                  console.error("Error inserting withdrawal detail:", error);
                  return;
                }
              }
            );
          } else {
            // Update existing record in WITHDRAWALDETAIL if WITHDRAWALDETAILID is positive
            const updateDetailSQL = `UPDATE WITHDRAWALDETAIL SET ITEMVARIATIONID = ?, QTY = ? WHERE ID = ?`;

            dbConnection.query(
              updateDetailSQL,
              [ITEMVARIATIONID, QTY, WITHDRAWALDETAILID],
              (error, result) => {
                if (error) {
                  console.error("Error updating withdrawal detail:", error);
                  return;
                }
              }
            );
          }
        }
      }

      res.status(200).json({
        message: "Withdrawal and details updated successfully",
        result,
      });
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

// DELETE

router.delete("/:Id", (req, res) => {
  const { Id } = req.params; // Get the WITHDRAWALDETAILID from request params

  const deleteSQL = `DELETE FROM WITHDRAWALDETAIL WHERE ID = ?`;

  dbConnection.query(deleteSQL, [Id], (error, result) => {
    if (error) {
      console.error("Error deleting withdrawal detail:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Check if any rows were affected (if no rows affected, ID may not exist)
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Withdrawal detail not found" });
      return;
    }

    // Respond with success message
    res.status(200).json({ message: "Withdrawal detail deleted successfully" });
  });
});

export default router;
