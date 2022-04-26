var express = require('express');
var router = express.Router();
const { MongoClient } = require('mongodb');
const axios = require('axios');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

const { NmapScan } = require('network-mapper');

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

async function runNmap(scanInfo) {
  return new Promise(async (resolve, reject) => {
    // --version-intensity setting for nmap
    // let scanIntensity;
    // switch (scanInfo.intensity) {
    //   case "Intense":
    //     scanIntensity = 9;
    //     break;
    //   case "Moderate":
    //     scanIntensity = 7;
    //   case "Light":
    //     scanIntensity = 2;
    //   default:
    //     break;
    // }
    console.log(`Starting scan id ${scanInfo._id} at ${new Date()}`);
    // set scan options and target
    const scan = new NmapScan({
      target: '192.168.0.1',
    });
    // await scan result
    const result = await scan.run();
    console.log(`Ending scan id ${scanInfo._id} at ${new Date()}`);
    // handle promise result
    if (result !== {} || result !== undefined) {
      resolve(result);
    } else {
      reject(new Error(`Error when running scan`));
    }
  });
}

router.post('/newScan', validateEmpty, async function (req, res) {
  try {
    if (!res.headersSent) {
      await client.connect();
      const database = client.db('homesec');
      const collection = database.collection('scans');
      const scan = req.body;
      const response = await collection.insertOne(scan);

      // Did MongoDB atlas complete the op successfully?
      if (response.acknowledged === false) {
        await client.close();
        res.status(500).send({
          message: 'Database Internal Server Error',
          description:
            'There was an error while writing your request to the database. Please try again.',
        });
      }

      //
      const toolInfo = scan.toolSelection;
      let scanResult;
      // console.log("Starting scan")
      // scanResult = await runNmap(scan);
      // console.log("Scan complete")
      // console.log(scanResult);

      // toolInfo.forEach(async (tool) => {
      //   if (tool.toolName === 'nmap') {
      //     console.log('Launching nmap scan')
      //     scanResult = await runNmap(scan);
      //   } //else if (tool.toolName === 'masscan') {
      //   //   const scanResult = runMasscan(scanInfo);
      //   // }
      // });

      for (let index = 0; index < toolInfo.length; index++) {
        if (toolInfo[index].toolName === 'nmap') {
          console.log('Launching nmap scan')
          scanResult = await runNmap(scan);
          console.log('Scan complete')
        }
      }

      // axios.post('http://127.0.0.1:3001/report/newReport', doc).then((response) => {
      //   // console.log(`Received response ${response.status}`);
      //   if (response.status === 200) {
      //     console.log(response.data.scanResult)
      //   } else if (response.status === 500) {
      //     res.status(500).send('Internal Server Error from /report/newReport')
      //   }
      // });

      //

      if (scanResult === undefined || scanResult.length === {}) {
        await client.close();
        res.status(500).send({
          message:
            'Something went wrong when trying to complete the network scan. Got an undefined or empty response from scanner()',
        });
      } else {
        await client.close();
        res.status(200).send({
          message: `Scan was completed and inserted with the _id: ${response.insertedId}`,
          report: scanResult,
        });
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

router.get('/getScans', async function (req, res) {
  try {
    await client.connect();
    const database = client.db('homesec');
    const collection = database.collection('scans');
    const docCount = await collection.countDocuments();
    if (docCount === 0) {
      await client.close();
      res.status(204).send(); //empty object to return
    } else {
      const scans = await collection.find({}).toArray();
      await client.close();
      res.status(200).send({ scans, docCount });
    }
  } catch (err) {
    await client.close();
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
      await client.close();
      res.status(200).send({
        message: 'There are no documents to delete.',
        documentsDeleted: 0,
      });
    } else {
      const deleteManyResult = await collection.deleteMany({});
      await client.close();
      res.status(200).send({
        message: `Deleted ${deleteManyResult.deletedCount} documents`,
        deletedDocuments: deleteManyResult.deletedCount,
      });
    }
  } catch (err) {
    await client.close();
    res.status(500).send({
      message: 'Internal Server Error',
      error: err,
    });
  }
});

module.exports = router;
