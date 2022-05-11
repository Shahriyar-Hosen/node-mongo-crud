const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config()
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
// ---------------------------

// async await function
async function run() {
    
    // try catch finally
    try {
      await client.connect();
      console.log("Database Connected YaY!")
      // const userCollection = client.db("foodExpress").collection("user");
        
    } finally {
        
    }
}
// call function catch (console dir)
run().catch(console.dir)
// --------------------------------------------

// http://localhost:5000/
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
