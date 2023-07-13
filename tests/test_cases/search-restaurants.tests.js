const { init } = require("../steps/init");
const when = require("../steps/when");
const { seed } = require("../../db/seed");
const teardown = require("../../db/teardown");
const given = require("../steps/given");

describe(`When we invoke the POST /restaurants/search endpoint with theme 'cartoon'`, () => {
  let user;

  beforeAll(async () => {
    await init();
    user = await given.an_authenticated_user();
  });

  beforeEach(async () => {
    //await seed();
  });

  afterEach(async () => {
    //await teardown.teardown();
  });

  afterAll(async () => {
    await teardown.an_authenticated_user(user);
  });

  it(`Should return an array of 4 restaurants`, async () => {
    let res = await when.we_invoke_search_restaurants("cartoon", user);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(4);

    for (let restaurant of res.body) {
      expect(restaurant).toHaveProperty("name");
      expect(restaurant).toHaveProperty("image");
    }
  });

  it(`Should return an empty array of restaurants when no theme`, async () => {
    let res = await when.we_invoke_search_restaurants("", user);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(0);

    for (let restaurant of res.body) {
      expect(restaurant).toHaveProperty("name");
      expect(restaurant).toHaveProperty("image");
    }
  });
});
