var express = require('express');
var router = express.Router();
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

router.get('/', function (req, res) {
  res.send('No data here...');
});

/* GET users listing. */
router.post('/newScan', async function (req, res, next) {
  try {
    await client.connect();
    const database = client.db('homesec');
    const collection = database.collection('scans');
    const doc = req.body;
    response = await collection.insertOne(doc);
    console.log(`A document was inserted with the _id: ${response.insertedId}`);
  } finally {
    await client.close();
    res.sendStatus(200);
  }
});

router.get('/getScans', async function (req, res, next) {
  try {
    await client.connect();
    const database = client.db('homesec');
    const collection = database.collection('scans');

    // since this method returns the matched document, not a cursor, print it directly
    if ((await collection.countDocuments()) === 0) {
      console.log('No documents found!');
      res.send({}); //empty object to return
    } else {
      const results = collection.find();
      res.send(results);
    }
    // change this to await for the results to come, then check if the length of results is 0
    res.sendStatus(200);
    await client.close();
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = router;
