var express = require('express');
const res = require('express/lib/response');
var router = express.Router();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

router.get('/', function (req, res) {
  res.sendStatus(405);
});

router.post('/getReports', async function(req, res) {
  console.log('Inside report/getReports')
  res.status(200).send("Hello from report/getReports");
  
})

module.exports = router;