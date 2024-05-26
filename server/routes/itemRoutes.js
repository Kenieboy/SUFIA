import express from "express";
import { dbConnection } from "../config/db.js";

const router = express.Router();

router.get("/", (req, res) => {
  const itemSQL = `SELECT * FROM ITEM ORDER BY CODE DESC`;

  dbConnection.query(itemSQL, (err, result) => {
    if (err) {
      console.error("Error fetching items:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    return res.json(result);
  });
});

// router.get("/itemclass", (req, res) => {
//   const itemSQL = `SELECT * FROM ITEMCLASS WHERE ISACTIVE=1 ORDER BY CODE DESC`;

//   dbConnection.query(itemSQL, (err, result) => {
//     if (err) {
//       console.error("Error fetching items:", err);
//       res.status(500).json({ error: "Internal Server Error" });
//       return;
//     }

//     return res.json(result);
//   });
// });

router.get("/itemunit", (req, res) => {
  const itemSQL = `SELECT * FROM ITEMUNIT WHERE ISACTIVE=1 ORDER BY CODE DESC`;

  dbConnection.query(itemSQL, (err, result) => {
    if (err) {
      console.error("Error fetching items:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    return res.json(result);
  });
});

// router.get("/itemcategory", (req, res) => {
//   const itemSQL = `SELECT * FROM ITEMCATEGORY WHERE ISACTIVE=1 ORDER BY CODE DESC`;

//   dbConnection.query(itemSQL, (err, result) => {
//     if (err) {
//       console.error("Error fetching items:", err);
//       res.status(500).json({ error: "Internal Server Error" });
//       return;
//     }

//     return res.json(result);
//   });
// });

router.get("/metadata/:type", (req, res) => {
  const { type } = req.params;
  let table;

  // Determine which table to query based on the type parameter
  switch (type) {
    case "itemclass":
      table = "ITEMCLASS";
      break;
    case "itemcategory":
      table = "ITEMCATEGORY";
      break;
    case "itemunit":
      table = "ITEMUNIT";
      break;
    default:
      return res.status(400).json({ error: "Invalid metadata type" });
  }

  const itemSQL = `SELECT * FROM ${table} WHERE ISACTIVE=1 ORDER BY CODE DESC`;

  dbConnection.query(itemSQL, (err, result) => {
    if (err) {
      console.error("Error fetching metadata:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    return res.json(result);
  });
});

export default router;
