const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectdb = require("./config/connectdb");
const userRoutes = require("./routes/userRoutes");
const debateRoutes = require("./routes/debateRoutes");
const participantRoutes = require("./routes/participantRoutes");
const argumentRoutes = require("./routes/argumentRoutes");
const voteRoutes = require("./routes/voteRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddlewares");
const app = express();
dotenv.config({ quiet: true });

const PORT = process.env.PORT || 4000;

const initServer = async () => {
  try {
    await connectdb();
    app.use(express.json());
    app.use(
      cors({
        origin: ["http://localhost:3000"],
        methods: ["POST", "GET", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: true,
      })
    );

    app.get("/", (_, res) => {
      res.status(200).send({ message: "Server is running" });
    });

    // api endpoints
    app.use("/api/users", userRoutes);
    app.use("/api/debates", debateRoutes);
    app.use("/api/participants", participantRoutes);
    app.use("/api/arguments", argumentRoutes);
    app.use("/api/votes", voteRoutes);

    // error handler
    app.use(notFound);
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server is runnning on port - ${PORT}`);
    });
  } catch (error) {
    console.log(`Server error - ${error.message}`);
    process.exit(1);
  }
};

initServer();
