var express = require('express');
var router = express.Router();
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

function verifyInput(input) {
  if (input.toolSelection === [] || input.intensity === '') {
    return false;
  } else {
    return true;
  }
}

router.get('/', function (req, res) {
  res.sendStatus(405);
});

const validateEmpty = (req, res, next) => {
  let body = req.body;
  // console.log(`Body obj: ${JSON.stringify(body)}`);
  // console.log(`Tool selection: ${JSON.stringify(body.toolSelection)}`);
  // console.log(`Intensity: ${body.intensity}`);

  // TODO: validation of toolSelection object within body.

  // scenarios that involve badly formed data from client
  if (
    body == {} ||
    body.toolSelection === undefined ||
    body.toolSelection.length === 0 ||
    body.intensity === undefined ||
    body.intensity.length === 0 ||
    typeof body.notiComplete != 'boolean' ||
    typeof body.notiReminders != 'boolean'
  ) {
    return res.status(400).send({
      error: 'invalid scan data',
    });
  }
  next();
};

router.post('/newScan', validateEmpty, async function (req, res) {
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

/* GET users listing. */
// router.post('/newScan', validateEmpty, async function (req, res, next) {
//   console.log(req.body);
//   if (verifyInput(req.body)) {
//     try {
//       await client.connect();
//       const database = client.db('homesec');
//       const collection = database.collection('scans');
//       const doc = req.body;
//       response = await collection.insertOne(doc);
//       console.log(
//         `A document was inserted with the _id: ${response.insertedId}`,
//       );
//     } finally {
//       await client.close();
//       res.sendStatus(200);
//     }
//   } else {
//     console.log('Invalid input received from frontend');
//     res.sendStatus(400);
//   }
// });

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
