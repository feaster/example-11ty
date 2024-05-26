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
    console.log(searchType);
    const filter = {};
    if (search.length > 0) {
      switch (searchType) {
        case "title":
          filter.title = search;
          break;
        case "author":
          filter.author = search;
          break;
        case "name":
          filter.name = search;
          break;
      }
      console.log(filter);
    }
    const results = await collection.find(filter).collation({locale: "en", strength: 1}).sort({ $natural: -1 }).limit(maxNumber).toArray();
    return {
      statusCode: 200,
      body: JSON.stringify(results)
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
}

module.exports = { handler }