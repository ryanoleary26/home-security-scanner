var express = require('express');
var router = express.Router();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

router.get('/', function (req, res) {
  res.sendStatus(405);
});

const validateEmpty = (req, res, next) => {
  let body = req.body;

  // Body obj length needs to be 5 keys
  if (Object.keys(body).length != 5) {
    return res.status(400).send({
      error: `Scan object contained unexpected data.`,
    });
  } else if (
    !body.hasOwnProperty('notiComplete') ||
    !body.hasOwnProperty('notiReminders') ||
    !body.hasOwnProperty('toolSelection') ||
    !body.hasOwnProperty('intensity') ||
    !body.hasOwnProperty('scanDate')
  ) {
    // toolSelection exists and contains valid data
    return res.status(400).send({
      error: `Scan object contains invalid property names.`,
    });
  } else if (
    body.toolSelection === undefined ||
    body.toolSelection === null ||
    body.toolSelection.length === 0 ||
    body.intensity === undefined ||
    body.intensity === null ||
    body.intensity.length === 0 ||
    typeof body.notiComplete != 'boolean' ||
    typeof body.notiReminders != 'boolean' ||
    body.scanDate === undefined ||
    body.scanDate === null
  ) {
    return res.status(400).send({
      error: 'Scan object contained invalid, undefined or null data.',
    });
  } else if (body.hasOwnProperty('toolSelection')) {
    body.toolSelection.map((tool) => {
      // scan obj has four keys
      // Check each tool obj for 3 keys
      if (Object.keys(tool).length != 3) {
        return res.status(400).send({
          error: `Tool object contains invalid properties`,
        });
      }

      // tool obj does contain 3 keys
      // check tool obj contains correct keys
      if (
        !tool.hasOwnProperty('id') ||
        !tool.hasOwnProperty('toolName') ||
        !tool.hasOwnProperty('description')
      ) {
        return res.status(400).send({
          error: `Tool selection object contains invalid property names.`,
        });
      }
      // if tool obj props contain undefined data
      if (
        tool.id === undefined ||
        tool.id === null ||
        tool.toolName === undefined ||
        tool.toolName === null ||
        tool.description === undefined ||
        tool.description === null
      ) {
        return res.status(400).send({
          error: `Tool ID:${tool.id} - ${tool.toolName} contains undefined or null data`,
        });
      }
    });
  }
  // continue to next
  next();
};

router.post('/newScan', validateEmpty, async function (req, res) {
  if (!res.headersSent) {
    await client.connect();
    const database = client.db('homesec');
    const collection = database.collection('scans');
    const doc = req.body;
    const response = await collection.insertOne(doc);
    console.log(
      `A scan document was inserted with the _id: ${response.insertedId}`,
    );
    res.status(200).send({
      message: `A scan document was inserted with the _id: ${response.insertedId}`,
    });
    await client.close();
  }
});

router.get('/getScans', async function (req, res) {
  try {
    await client.connect();
    const database = client.db('homesec');
    const collection = database.collection('scans');
    const docCount = await collection.countDocuments();
    if (docCount === 0) {
      res.status(204).send(); //empty object to return
    } else {
      const scans = await collection.find({}).toArray();
      res.status(200).send({ scans, docCount });
    }
    await client.close();
  } catch (err) {
    res.status(500).send({
      message: 'Internal Server Error',
      error: err,
    });
  }
});

router.post('/deleteScans', async function (req, res) {
  try {
    await client.connect();
    const database = client.db('homesec');
    const collection = database.collection('scans');
    const docCount = await collection.countDocuments();
    if (docCount === 0) {
      res.status(200).send({
        message: 'There are no documents to delete.',
        documentsDeleted: 0,
      });
    } else {
      const deleteManyResult = await collection.deleteMany({});
      res.status(200).send({
        message: `Deleted ${deleteManyResult.deletedCount} documents`,
        deletedDocuments: deleteManyResult.deletedCount,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: 'Internal Server Error',
      error: err,
    });
  }
});

module.exports = router;
