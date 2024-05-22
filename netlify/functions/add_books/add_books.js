const axios = require("axios");
require('dotenv').config();

exports.handler = async function (event, context) {
    try {
        const { title, author, read } = event.queryStringParameters;
        const dataToSend = {
            title,
            author,
            read,
        };

        const sendToDatabase = await axios({
            "method": "POST",
            "url": `${process.env.MONGODB_DATA_API_URL}/action/insertOne`,
            "headers": {
                "api-key": `${process.env.MONGODB_DATA_API_KEY}`,
                "Accept": "application/json"
            },
            "data": {
                "dataSource": "Cluster0",
                "database": "sample_mflix",
                "collection": "books",
                "document": dataToSend,
            },
        }).catch(function (error) {
            if (error.response) {
              console.log('Server responded with status code:', error.response.status);
              console.log('Response data:', error.response.data);
            } else if (error.request) {
              console.log('No response received:', error.request);
            } else {
              console.log('Error creating request:', error.message);
            }
          });
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "hello world" })
        };
    } catch (error) {
        return { statusCode: 500, body: error.toString() };
    }

    
};