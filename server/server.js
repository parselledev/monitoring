require('dotenv').config();
require('express-async-errors');
const express = require('express');
const { logger, logEvents } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const app = express();
const port = process.env.PORT || 3500;

connectDB();

app.use(logger);
app.use(express.json());
app.use('/', require('./routes/root'));

const server = require('http').createServer(app);

app.use('/signals', require('./routes/signalRoutes'));
app.all('*', require('./routes/404'));

app.use(errorHandler);

mongoose.connection.once('open', () => {
  server.listen(port, () => {
    console.log(
      `✅ Successfully Connected to MongoDB | Application running on port: ${port}`
    );
  });
});

mongoose.connection.on('error', (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}\t`,
    'mongoDBErrLog.log'
  );
});
