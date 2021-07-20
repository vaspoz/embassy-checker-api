const messagebird = require('messagebird')(process.env.MESSAGE_BIRD_KEY);
const config = require('../config.json');
const redis = require("redis");

const publisher = redis.createClient();

module.exports = (text) => {
    
    publishToChannel(text);

    if (config.sendSMS) sendSMS(text);
};

const publishToChannel = (text) => {
  publisher.publish(config.redisChannelName, text);

}
const sendSMS = (text) => {
    const params = {
        'originator': 'REDACTED-PHONE',
        'recipients': [
            'REDACTED-PHONE'
        ],
        'body': text
    };

    messagebird.messages.create(params, function (err, response) {
        if (err) {
            return console.log(err);
        }
        console.log(response);
    });
}