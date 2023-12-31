const { DynamoDB } = require("aws-sdk");
const { marshall } = require("@aws-sdk/util-dynamodb");
const dynamoDB = new DynamoDB({
  region: "us-east-1",
});

require("dotenv").config();

module.exports.seed = async (event, context) => {
  const restaurants = [
    {
      name: "Fangtasia",
      image: "https://d2qt42rcwzspd6.cloudfront.net/manning/fangtasia.png",
      themes: ["true blood"],
    },
    {
      name: "Shoney's",
      image: "https://d2qt42rcwzspd6.cloudfront.net/manning/shoney's.png",
      themes: ["cartoon", "rick and morty"],
    },
    {
      name: "Freddy's BBQ Joint",
      image:
        "https://d2qt42rcwzspd6.cloudfront.net/manning/freddy's+bbq+joint.png",
      themes: ["netflix", "house of cards"],
    },
    {
      name: "Pizza Planet",
      image: "https://d2qt42rcwzspd6.cloudfront.net/manning/pizza+planet.png",
      themes: ["netflix", "toy story"],
    },
    {
      name: "Leaky Cauldron",
      image: "https://d2qt42rcwzspd6.cloudfront.net/manning/leaky+cauldron.png",
      themes: ["movie", "harry potter"],
    },
    {
      name: "Lil' Bits",
      image: "https://d2qt42rcwzspd6.cloudfront.net/manning/lil+bits.png",
      themes: ["cartoon", "rick and morty"],
    },
    {
      name: "Fancy Eats",
      image: "https://d2qt42rcwzspd6.cloudfront.net/manning/fancy+eats.png",
      themes: ["cartoon", "rick and morty"],
    },
    {
      name: "Don Cuco",
      image: "https://d2qt42rcwzspd6.cloudfront.net/manning/don%20cuco.png",
      themes: ["cartoon", "rick and morty"],
    },
  ];

  const putRequest = restaurants.map((restaurant) => ({
    PutRequest: {
      Item: marshall(restaurant),
    },
  }));

  console.log(process.env.restaurants_table);

  const request = {
    RequestItems: {
      [process.env.restaurants_table]: putRequest,
    },
  };

  await dynamoDB.batchWriteItem(request).promise();
};
