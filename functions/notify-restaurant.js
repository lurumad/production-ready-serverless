const {
  EventBridgeClient,
  PutEventsCommand,
} = require("@aws-sdk/client-eventbridge");
const eventBridge = new EventBridgeClient();
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const sns = new SNSClient();

const busName = process.env.bus_name;
const topicArn = process.env.restaurant_notification_topic;

module.exports.handler = async (event) => {
  const order = event.detail;
  const publishCommand = new PublishCommand({
    Message: JSON.stringify(order),
    TopicArn: topicArn,
  });

  await sns.send(publishCommand);

  console.log(
    `notified restaurant [${order.restaurantName}] of order [${order.orderId}]`
  );

  const putEventsCommand = new PutEventsCommand({
    Entries: [
      {
        Source: "big-mouth",
        DetailType: "restaurant_notified",
        Detail: JSON.stringify({ order }),
        EventBusName: busName,
      },
    ],
  });

  await eventBridge.send(putEventsCommand);

  console.log(`published 'restaurant_notified' event into EventBridge`);
};
