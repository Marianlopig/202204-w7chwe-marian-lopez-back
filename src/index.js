require("dotenv").config();
const debug = require("debug")("isdiGram:root");
const chalk = require("chalk");
const connectDB = require("./database");
const { startServer } = require("./server");

const port = process.env.SERVER_PORT || 3000;
const mongoConnection = process.env.MONGO_URI;

(async () => {
  try {
    await connectDB(mongoConnection);
    await startServer(port);
  } catch (error) {
    debug(chalk.red(`Error: `, error.message));
  }
})();
