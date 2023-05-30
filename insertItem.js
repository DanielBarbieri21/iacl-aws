"use strict";

const { v4 } = require("uuid");
const AWS = require("aws-sdk");


AWS.config.update({
  region: "us-east-1", 
});

const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB.DocumentClient();

const insertItem = async (event) => {
  const { item } = JSON.parse(event.body);
  const createdAt = new Date().toISOString();
  const id = v4();

  const newItem = {
    id,
    item,
    createdAt,
    itemStatus: false,
  };

  try {
    
    const fileKey = `uploads/${id}.txt`; 
    const fileContent = "Arquivo teste"; 

    await s3
      .putObject({
        Bucket: "d2-bucket", 
        Key: fileKey,
        Body: fileContent,
      })
      .promise();

    
    await dynamodb
      .put({
        TableName: "Tabledados", 
        Item: newItem,
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(newItem),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to insert item" }),
    };
  }
};

module.exports = {
  handler: insertItem,
};
