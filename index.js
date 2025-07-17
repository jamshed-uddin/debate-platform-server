const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
dotenv.config({ quiet: true });

const PORT = process.env.PORT || 4000;

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

app.listen(PORT, () => {
  console.log(`Server is runnning on port - ${PORT}`);
});
