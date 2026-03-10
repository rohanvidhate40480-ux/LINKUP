import express from "express";
import confirmationRoutes from "./routes/confirmationRoutes";

const app = express();

app.use(express.json());
app.use("/api", confirmationRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default app;
