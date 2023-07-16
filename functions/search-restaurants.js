const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { unmarshall, marshall } = require("@aws-sdk/util-dynamodb");
const middy = require("@middy/core");
const ssm = require("@middy/ssm");
const dynamodb = new DynamoDB();

const { serviceName, ssmStage } = process.env;
const tableName = process.env.restaurants_table;
const middyCacheEnabled = JSON.parse(process.env.middy_cache_enabled);
const middyCacheExpiry = parseInt(process.env.middy_cache_expiry_milliseconds);

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
  console.log("====================================");
  console.info(context.secretString);
  const request = JSON.parse(event.body);
  const theme = request.theme;

  const restaurants = await findRestaurantsByTheme(theme, 8);
  console.log("====================================");
  console.log(restaurants);
  const response = {
    statusCode: 200,
    body: JSON.stringify(restaurants),
  };

  return response;
};
