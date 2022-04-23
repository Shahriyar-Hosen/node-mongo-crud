const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
// ---------------------------

// http://localhost:5000/
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
