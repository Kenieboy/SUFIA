import express from "express";
import cors from "cors";

//import api routes request
import homeRoutes from "./routes/homeRoutes.js";
import firmRoutes from "./routes/firmRoutes.js";


const app = express();
const PORT = 3001;

// middlewares
app.use(express.json());
app.use(cors());

// api request
app.use("/", homeRoutes);
app.use("/api/firm", firmRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
