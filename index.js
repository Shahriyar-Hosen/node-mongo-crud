const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// user: dbuser1
// pass: cWMeLT0Yzucz89hH

const uri =
  "mongodb+srv://dbuser1:cWMeLT0Yzucz89hH@cluster0.d76bb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const userCollection = client.db("foodExpress").collection("user");
    app.post("/user", (req, res) => {
      const newUser = req.body;
      console.log("New user adding", newUser);
      res.send({ result: "success" });
    });

    // const result = await userCollection.insertOne(user);
    // console.log(`User insert with id: ${result.insertedId}`);
  
  } 
  finally {
    // await client.close()
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running My Node Mongo Server");
});

app.listen(port, () => {
  console.log("CRUD Server is Running ");
});
