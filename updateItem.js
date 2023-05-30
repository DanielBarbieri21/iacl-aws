"use strict";

const AWS = require("aws-sdk");


AWS.config.update({
  region: "us-east-1", 
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

const updateItem = async (event) => {
  const { itemStatus } = JSON.parse(event.body);
  const { id } = event.pathParameters;

  try {
    await dynamodb
      .update({
        TableName: "Tabledados", 
        Key: { id },
        UpdateExpression: "set itemStatus = :itemStatus",
        ExpressionAttributeValues: {
          ":itemStatus": itemStatus,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ msg: "Item updated" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to update item" }),
    };
  }
};

module.exports = {
  handler: updateItem,
};
