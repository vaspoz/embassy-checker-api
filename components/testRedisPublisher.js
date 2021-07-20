const redis = require("redis");

const publisher = redis.createClient();

publisher.publish('a channel', 'hello redis');
publisher.quit();