const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const cors = require("CORS");

const app = express();
const port = process.env.PORT || 4200;

//
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dywnj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const database = client.db("bikebdServer");
    const bikeCollection = database.collection("bikeCollection");
    const bookingCollection = database.collection("booking");

    // GET API
    app.get("/bike", async (req, res) => {
      const bike = bikeCollection.find({});
      const result = await bike.toArray();
      res.json(result);
    });

    // dynamec API
    app.get("/bike/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bikeCollection.findOne(query);
      res.json(result);
    });

    app.get("/booking", async (req, res) => {
      const user = req.query.user;
      const query = { user: user };
      const booking = await bookingCollection.find(query).toArray();
      res.json(booking);
    });

    app.post("/booking", async (req, res) => {
      const booking = req.body;
      const query = { singleBike: booking.singleBike, user: booking.user };
      const exisis = await bookingCollection.findOne(query);
      if (exisis) {
        return res.send({ success: false, booking: exisis });
      }
      const result = await bookingCollection.insertOne(booking);
      return res.json({ success: true, result });
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
