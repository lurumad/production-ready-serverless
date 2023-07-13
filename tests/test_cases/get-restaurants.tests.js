const { init } = require("../steps/init");
const when = require("../steps/when");
const { seed } = require("../../db/seed");
const teardown = require("../../db/teardown");

describe(`When we invoke the GET /restaurants endpoint`, () => {
  beforeAll(async () => {
    await init();
    await seed();
  });

  afterAll(async () => {
    await teardown.teardown();
  });

  it(`Should return an array of 8 restaurants`, async () => {
    const res = await when.we_invoke_get_restaurants();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(8);

    for (let restaurant of res.body) {
      expect(restaurant).toHaveProperty("name");
      expect(restaurant).toHaveProperty("image");
    }
  });
});
