const app = require("./app");
const env = require("./config/env");
const connectDatabase = require("./config/db");

const startServer = async () => {
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(`API server listening on port ${env.port}`);
  });
};

startServer().catch((error) => {
  console.error("Server startup failed", error);
  process.exit(1);
});
