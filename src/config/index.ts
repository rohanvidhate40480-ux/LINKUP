import dotenv from "dotenv";

dotenv.config();

export const config = {
  smtp: {
    host: process.env.SMTP_HOST || "smtp.example.com",
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
  emailFrom: process.env.EMAIL_FROM || "noreply@linkup.app",
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  port: parseInt(process.env.PORT || "3000", 10),
};
