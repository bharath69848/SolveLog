import express from 'express'
import authRoutes from "./routes/authRoutes.js"
import cors from "cors"

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.use("/api/auth/", authRoutes);

app.listen(PORT,() => {
  console.log("Server Running on Port:",PORT);
})