const when = require("../steps/when");
const given = require("../steps/given");
const tearDown = require("../steps/tearDown");
const { init } = require("../steps/init");
const { EventBridgeClient } = require("@aws-sdk/client-eventbridge");

const mockSend = jest.fn();
EventBridgeClient.prototype.send = mockSend;

describe(`Given an authenticated user`, () => {
  let user;

  beforeAll(async () => {
    await init();
    user = await given.an_authenticated_user();
  });

  afterAll(async () => {
    await tearDown.an_authenticated_user(user);
  });

  describe(`When we invoke the POST /orders endpoint`, () => {
    let response;

    beforeAll(async () => {
      mockSend.mockClear();
      mockSend.mockReturnValue({
        promise: async () => {},
      });

      response = await when.we_invoke_place_order(user, "Fangtasia");
    });

    it(`Should return 200`, async () => {
      expect(response.statusCode).toEqual(200);
    });

    if (process.env.TEST_MODE === "handler") {
      it(`Should publish a message to EventBridge bus`, async () => {
        expect(mockSend).toHaveBeenCalledTimes(1);
        const [putEventsCommand] = mockSend.mock.calls[0];
        expect(putEventsCommand.input).toEqual({
          Entries: [
            expect.objectContaining({
              Source: "big-mouth",
              DetailType: "order_placed",
              Detail: expect.stringContaining(`"restaurantName":"Fangtasia"`),
              EventBusName: process.env.bus_name,
            }),
          ],
        });
      });
    }
  });
});
