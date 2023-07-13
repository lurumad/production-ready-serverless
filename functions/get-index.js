const fs = require("fs");
const Mustache = require("mustache");
const http = require("axios");
const aws4 = require("aws4");
const URL = require("url");

const restaurantsApiRoot = process.env.restaurants_api;
const cognitoUserPoolId = process.env.cognito_user_pool_id;
const cognitoClientId = process.env.cognito_client_id;
const awsRegion = process.env.AWS_REGION;
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let html;

function loadHtml() {
  if (!html) {
    console.log("loading index.html...");
    html = fs.readFileSync("static/index.html", "utf-8");
    console.log("loaded");
  }
  return html;
}

const getRestaurantes = async () => {
  console.log(`loading restaurants from API ${restaurantsApiRoot}...`);
  const url = URL.parse(restaurantsApiRoot);
  const options = {
    host: url.hostname,
    path: url.pathname,
  };

  aws4.sign(options);

  const httpRequest = http.get(restaurantsApiRoot, {
    headers: options.headers,
  });

  return (await httpRequest).data;
};

module.exports.handler = async (event, context) => {
  const restaurants = await getRestaurantes();
  console.log(`found ${restaurants.length} restaurants`);
  const template = loadHtml();
  const dayOfWeek = days[new Date().getDay()];
  const view = {
    awsRegion,
    cognitoUserPoolId,
    cognitoClientId,
    dayOfWeek,
    restaurants,
    searchUrl: `${restaurantsApiRoot}/search`,
  };
  const html = Mustache.render(template, view);
  const response = {
    statusCode: 200,
    headers: {
      "content-type": "text/html, charset=utf-8",
    },
    body: html,
  };

  return response;
};
