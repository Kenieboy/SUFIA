import express from "express";
import cors from "cors";

//import api routes request
import homeRoutes from "./routes/homeRoutes.js";
import firmRoutes from "./routes/firmRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";

const app = express();
const PORT = 3001;

// middlewares
app.use(express.json());
app.use(cors());

// api request
app.use("/", homeRoutes);

// firm table
app.use("/api/firm", firmRoutes);

// item table
app.use("/api/items", itemRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
