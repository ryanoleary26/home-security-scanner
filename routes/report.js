const { default: BSON } = require('bson');
var express = require('express');
const res = require('express/lib/response');
var router = express.Router();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

router.get('/', function (req, res) {
  res.sendStatus(405);
});

router.get('/getReports', async function (req, res) {
  try {
    if (!res.headersSent) {
      await client.connect();
      const database = client.db('homesec');
      const collection = database.collection('reports');
      const docCount = await collection.countDocuments();
      if (docCount === 0) {
        await client.close();
        res.status(204).send(); //empty object to return
      } else {
        const reports = await collection.find({}).toArray();
        await client.close();
        res.status(200).send({ reports: reports, docCount });
      }
    }
  } catch (err) {
    await client.close();
    res.status(500).send({
      message: 'Internal Server Error',
      error: err.message,
    });
  }
});

router.get('/singleReport/:reportID', async function (req, res) {
  // find reportID in collection and return the data
  try {
    if (!res.headersSent) {
      await client.connect();
      const query = { "_id": BSON.ObjectId(req.params.reportID) };
      const database = client.db('homesec');
      const collection = database.collection('reports');
      const response = await collection.findOne(query).catch(err => console.error(`Failed to find documents: ${err}`));
      if (response === undefined || response === null || response.length === {}) {
        res.status(204).send()
      } else {
        res.status(200).send({ response })
      }
    }
  } catch (err) {
    await client.close();
    res.status(500).send({
      message: 'Internal Server Error',
      error: err,
    });
  }
  // add no match, returning nothing, or 400 bad request
})

module.exports = router;