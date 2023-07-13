const { DynamoDB, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const { unmarshall, marshall } = require("@aws-sdk/util-dynamodb");
const dynamoDB = new DynamoDB({
  region: "us-east-1",
});
const {
  CognitoIdentityProviderClient,
  AdminDeleteUserCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

require("dotenv").config();

const teardown = async () => {
  const restaurants = await allRestaurants();
  await deleteAllRestaurants(restaurants);
};

const allRestaurants = async () => {
  const req = {
    TableName: process.env.restaurants_table,
  };

  const resp = await dynamoDB.scan(req);
  let items = [];
  items = [...items, ...resp.Items];
  while (resp.LastEvaluatedKey) {
    req.ExclusiveStartKey = resp.LastEvaluatedKey;
    resp = await dynamoDB.scan(req);
    items = [...items, ...resp.Items];
  }
  return resp.Items.map(unmarshall);
};

const deleteAllRestaurants = async (restaurants) => {
  const deleteCommands = restaurants.map(
    (restaurant) =>
      new DeleteItemCommand({
        TableName: process.env.restaurants_table,
        Key: marshall({ name: restaurant.name }),
      })
  );

  deleteCommands.forEach(async (deleteRequest) => {
    await dynamoDB.send(deleteRequest);
  });
};

const an_authenticated_user = async (user) => {
  const cognito = new CognitoIdentityProviderClient();

  let req = new AdminDeleteUserCommand({
    UserPoolId: process.env.cognito_user_pool_id,
    Username: user.username,
  });
  await cognito.send(req);

  console.log(`[${user.username}] - user deleted`);
};

module.exports = {
  an_authenticated_user,
  teardown,
};
