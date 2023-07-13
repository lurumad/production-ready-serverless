const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { unmarshall, marshall } = require("@aws-sdk/util-dynamodb");
const dynamodb = new DynamoDB();

const defaultResults = process.env.defaultResults || 8;
const tableName = process.env.restaurants_table;

const findRestaurantsByTheme = async (theme, count) => {
  console.log(`finding (up to${count}) restaurants with the theme ${theme}...`);
  const request = {
    TableName: tableName,
    Limit: count,
    FilterExpression: "contains(themes, :theme)",
    ExpressionAttributeValues: marshall({ ":theme": theme }),
  };

  const response = await dynamodb.scan(request);
  console.log(`found ${response.Items.length} restaurants`);
  return response.Items.map(unmarshall);
};

module.exports.handler = async (event, context) => {
  const request = JSON.parse(event.body);
  const theme = request.theme;

  const restaurants = await findRestaurantsByTheme(theme, defaultResults);

  const response = {
    statusCode: 200,
    body: JSON.stringify(restaurants),
  };

  return response;
};
