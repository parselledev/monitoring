import { Router } from 'express';

const signalsRoute = Router();

// This will help us connect to the database
const dbo = require('../db/conn');

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require('mongodb').ObjectId;

// This section will help you get a list of all the records.
signalsRoute.route('/signals').get(function (req, res) {
  let db_connect = dbo.getDb('employees');
  db_connect
    .collection('records')
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

module.exports = signalsRoute;
