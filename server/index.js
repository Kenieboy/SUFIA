import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

//import api routes request
import homeRoutes from "./routes/homeRoutes.js";
import firmRoutes from "./routes/firmRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import purchaseDeliveryRoutes from "./routes/purchaseDeliveryRoute.js";
import withdrawalRoutes from "./routes/withdrawalRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import auth from "./routes/auth.js";

const app = express();
const PORT = 3001;

// middlewares

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(bodyParser.json());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// api request
app.use("/", homeRoutes);

// auth
app.use("/api/auth", auth);

// user
app.use("/api/user", userRoutes);

// firm table
app.use("/api/firm", firmRoutes);

// item table
app.use("/api/items", itemRoutes);

// purchasedelivery table
app.use("/api/purchasedelivery", purchaseDeliveryRoutes);

// withdrawal table
app.use("/api/withdrawal", withdrawalRoutes);

// reports
app.use("/api/report", reportRoutes);

//settings
app.use("/api/settings", settingsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
