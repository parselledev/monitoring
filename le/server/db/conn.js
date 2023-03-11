import { MongoClient } from 'mongodb';

const mongoClient = new MongoClient(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let _db;

export const connectToServer = (callback) => {
  client.connect(function (err, db) {
    if (db) {
      _db = db.db('employees');
      console.log('Successfully connected to MongoDB.');
    }
    return callback(err);
  });
};

export const getDb = () => _db;
