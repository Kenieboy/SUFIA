import { dbConnection } from "../config/db.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  //CHECK USER IF EXISTS

  const userSQL = `SELECT * FROM USERS WHERE USERNAME= ?`;

  dbConnection.query(userSQL, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);

    if (data.length) return res.status(409).json("User already exisits!");

    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(req.body.password);

    const values = [
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.name,
    ];

    const q =
      "INSERT INTO USERS (`USERNAME`, `EMAIL`, `PASSWORD`, `NAME`) VALUES (?)";

    dbConnection.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json("User has been created.");
    });
  });
};

export const login = (req, res) => {
  const loginSQL = "SELECT * FROM USERS WHERE USERNAME = ?";

  dbConnection.query(loginSQL, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);

    if (data.length === 0) return res.status(404).json("User not found!");

    const checkPassword = bcryptjs.compareSync(
      req.body.password,
      data[0].PASSWORD
    );

    if (!checkPassword)
      return res.status(400).json("Wrong password or username!");

    const token = jwt.sign({ id: data[0].id }, "secretkey");

    const { password, ...others } = data[0];

    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("User has been logged out.");
};
