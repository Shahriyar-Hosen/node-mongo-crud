const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const objectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// user: dbuser1
// pass: cWMeLT0Yzucz89hH

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d76bb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const userCollection = client.db("foodExpress").collection("user");

    // Get  api to read all user

    app.get("/user", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });
    // -------------------------------------------

    // Get  AP to Read by ID

    app.get("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: objectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });
    // -------------------------------------------

    //  Get  AP to Read by  Search query

    // Load data based on the page number and size
    app.get("/user", async (req, res) => {
      console.log(req.query);
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);

      const query = {};
      const cursor = userCollection.find(query);
      let users;

      if (page || size) {
        // 0 --> skip: 0*10 get: 0-10 (10)
        // 1 --> skip: 1*10 get: 11-20 (10)
        // 2 --> skip: 2*10 get: 21-30 (10)
        users = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        users = await cursor.toArray();
      }

      res.send(users);
    });
    // --------------------------------------

    // Create user api in db

    app.post("/user", async (req, res) => {
      const newUser = req.body;
      console.log("New user adding ", newUser);
      const result = await userCollection.insertOne(newUser);
      console.log(`User insert with id: ${result.insertedId}`);
      res.send({ result: "success" });
    });
    // -------------------------------------------

    //  Update user data in db

    app.put("/user/:id", async (req, res) => {
      const id = req.params.id;
      const updateUser = req.body;
      const filter = { _id: objectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: updateUser,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);

      res.send(result);
    });
    // -------------------------------------------

    //  Delete user in db

    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: objectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });
    // -------------------------------------------

    // Pagination

    app.get("/userCount", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const count = await cursor.count();
      res.send({ count });
    });
    // -------------------------------------------
  } finally {
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
