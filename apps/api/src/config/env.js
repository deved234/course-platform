const dotenv = require("dotenv");

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
};

if (!env.mongodbUri) {
  throw new Error("MONGODB_URI is required in environment variables.");
}

if (!env.jwtSecret) {
  throw new Error("JWT_SECRET is required in environment variables.");
}

module.exports = env;
