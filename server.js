const express = require("express");
const app = express();
const port = 3000;
const userProfileRouter = require("./routes/userProfiles");
const importRouter = require("./routes/imports");
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

// Input all routes here
app.use("/api/userProfile", userProfileRouter);
app.use("/api/imports", importRouter);

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});
app.listen(port, () => {
  console.log(`Warehouse tool listening at http://localhost:${port}`);
});
