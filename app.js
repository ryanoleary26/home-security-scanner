const express = require("express");
require("dotenv").config();

app = express();

app.use("/api/", require("./routes/hello"));
// app.get("/", (req, res) => {
//   res.send("hello ryan");
// });

const { MongoClient, ServerApiVersion } = require("mongodb");
// const uri = process.env.MONGO_URI;
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverApi: ServerApiVersion.v1,
// });

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
async function run() {
  try {
    await client.connect();
    const database = client.db("homesec");
    const haiku = database.collection("scans");
    // create a document to insert
    const doc = {
      title: "Record of a Shriveled Datum",
      content: "No bytes, no problem. Just insert a document, in MongoDB",
    };
    const result = await haiku.insertOne(doc);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    await client.close();
  }
}
// run().catch(console.dir);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
