import dotenv from "dotenv";
dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === "") {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const env = {
  PORT: parseInt(process.env.PORT || "5000", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",

  DATABASE_URL: required("DATABASE_URL"),

  GEMINI_API_KEY: required("GEMINI_API_KEY", "missing"),
  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.5-flash",

  CLOUDINARY_CLOUD_NAME: required("CLOUDINARY_CLOUD_NAME", "missing"),
  CLOUDINARY_API_KEY: required("CLOUDINARY_API_KEY", "missing"),
  CLOUDINARY_API_SECRET: required("CLOUDINARY_API_SECRET", "missing"),
  CLOUDINARY_FOLDER: process.env.CLOUDINARY_FOLDER || "chitralai/resumes",

  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB || "10", 10),
};
