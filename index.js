const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const objectId = require("mongodb").ObjectId;
const port = process.env.PORT || 4000;

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

    // JWT Token
    // AUTH
    app.post("/login", async (req, res) => {
      // Secret key
      /* Terminal - node - require('crypto').randomBytes(64).toString('hex') - cp token - .env create ACCESS_TOKEN_SECRET & than cp token*/

      const user = req.body;
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });
      res.send({accessToken})
    });

    // Get  api to read all user

    app.get("/user", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // -------------------------------------------

    // Get  api to read limited user

    app.get("/product", async (req, res) => {
      console.log("query", req.query);
      const query = {};
      const cursor = userCollection.find(query);
      const result = await cursor.limit(15).toArray();
      res.send(result);
    });

    // --------------------------------------------------------

    // Get  AP to Read by ID

    app.get("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: objectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });
    // -------------------------------------------

    //  Get  AP to Read by  Search query

    app.get("/order", async (req, res) => {
      const query = { email: req.query.email };
      const cursor = userCollection.find(query);
      const order = await cursor.toArray();
      res.send(order);
    });

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
    // --------------------------------------------------------

    // Use Post to load some users using keys
    // Use post to get users by ids
    app.post("/userByKeys", async (req, res) => {
      const keys = req.body;
      const ids = keys.map((id) => ObjectId(id));
      const query = { _id: { $in: ids } };
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      console.log(keys);
      res.send(products);
    });
    // ----------------------------------------------------

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
      const count = await userCollection.estimatedDocumentCount();
      console.log(count);
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
