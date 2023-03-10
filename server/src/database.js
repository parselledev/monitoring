import { MongoClient } from "mongodb";

const mongoUrl = "mongodb://127.0.0.1:27017/";
const mongoClient = new MongoClient(mongoUrl);

const addSignal = async (signal) => {
  const readySignal = { ...signal };

  try {
    await mongoClient.connect();
    await mongoClient.db("dozor").collection("signals").insertOne(readySignal);
    console.log("Запись в БД");
  } catch (err) {
    console.log(`DATABASE ERROR ${err.code}`);
  } finally {
    await mongoClient.close();
  }
};

export const database = {
  addSignal,
};
