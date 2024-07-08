import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

//import api routes request
import homeRoutes from "./routes/homeRoutes.js";
import firmRoutes from "./routes/firmRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import purchaseDeliveryRoutes from "./routes/purchaseDeliveryRoute.js";

const app = express();
const PORT = 3001;

// middlewares
app.use(bodyParser.json());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// api request
app.use("/", homeRoutes);

// firm table
app.use("/api/firm", firmRoutes);

// item table
app.use("/api/items", itemRoutes);

// purchasedelivery table
app.use("/api/purchasedelivery", purchaseDeliveryRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
