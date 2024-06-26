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
    const search = event.queryStringParameters.search;
    const searchType = event.queryStringParameters.searchType;

    if (search.length === 0) {
      const results = await collection.find({}).sort({ $natural: -1 }).limit(maxNumber).toArray();
      return {
        statusCode: 200,
        body: JSON.stringify(results)
      };
    } else if (searchType === "author") {
      const results = await collection.find({ author: { $regex: `${search}`, $options: 'i' } }).sort({ $natural: -1 }).limit(maxNumber).toArray();
      return {
        statusCode: 200,
        body: JSON.stringify(results)
      };
    } else if (searchType === "title") {
      const results = await collection.find({ title: { $regex: `${search}`, $options: 'i' } }).sort({ $natural: -1 }).limit(maxNumber).toArray();
      return {
        statusCode: 200,
        body: JSON.stringify(results)
      };
    } else if (searchType === "name") {
      const results = await collection.find({ name: { $regex: `${search}`, $options: 'i' } }).sort({ $natural: -1 }).limit(maxNumber).toArray();
      return {
        statusCode: 200,
        body: JSON.stringify(results)
      };
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
}

module.exports = { handler }