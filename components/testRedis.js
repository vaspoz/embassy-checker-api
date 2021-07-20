const redis = require("redis");

const subscriber = redis.createClient();
const publisher = redis.createClient();
const admin = redis.admin();

let messageCount = 0;

console.log('Start');

// subscriber.on("subscribe", function(channel, count) {
//   publisher.publish("a channel", "a message");
//   publisher.publish("a channel", "another message");
// });

subscriber.on("message", function(channel, message) {
  messageCount += 1;

  console.log("Subscriber received message in channel '" + channel + "': " + message + ": " + messageCount);

  if (messageCount === 4) {
    subscriber.unsubscribe();
    subscriber.quit();
    publisher.quit();
  }
});

subscriber.subscribe("a channel");
// publisher.publish('TEST-channel', 'hello redis');
