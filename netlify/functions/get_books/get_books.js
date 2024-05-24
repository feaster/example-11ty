const { MongoClient } = require("mongodb");
require('dotenv').config();

const mongoClient = new MongoClient(process.env.MONGODB_URI);

const clientPromise = mongoClient.connect();

const handler = async (event) => {
  try {
    const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collection = database.collection(process.env.MONGODB_COLLECTION);
    let maxNumber = event.queryStringParameters.limit;
    maxNumber = Number(maxNumber);
    const results = await collection.find({}).limit(maxNumber).toArray();
    return {
      statusCode: 200,
      body: JSON.stringify(results)
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
}

module.exports = { handler }