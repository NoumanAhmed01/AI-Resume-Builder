import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

//DB connection
await connectDB();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is live...");
});

app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
