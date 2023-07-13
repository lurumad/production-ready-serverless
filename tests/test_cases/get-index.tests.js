const cheerio = require("cheerio");
const when = require("../steps/when");
const { init } = require("../steps/init");
const { seed } = require("../../db/seed");
const teardown = require("../../db/teardown");

describe(`When we invoke the GET / endpoint`, () => {
  beforeAll(async () => {
    await init();
    //await seed();
  });

  afterAll(async () => {
    //await teardown.teardown();
  });

  it(`Should return the index page with 8 restaurants`, async () => {
    const res = await when.we_invoke_get_index();

    expect(res.statusCode).toEqual(200);
    expect(res.headers["content-type"]).toEqual("text/html, charset=utf-8");
    expect(res.body).toBeDefined();

    const $ = cheerio.load(res.body);
    const restaurants = $(".restaurant", "#restaurantsUl");
    expect(restaurants.length).toEqual(8);
  });
});
