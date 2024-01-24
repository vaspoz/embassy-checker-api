let messagebird;
const config = require("../config.json");

module.exports = (text) => {
    if (config.sendSMS) sendSMS(text);
};

const initMessageBird = () => {
    if (messagebird) return;
    if (!process.env.MESSAGEBIRD_API_KEY) {
        console.log("[MessageBird] Couldn't find the api key in env variable, sms won't be send.");
        throw new Error();
    }
    messagebird = require("messagebird").initClient(process.env.MESSAGEBIRD_API_KEY);
};

const sendSMS = (text) => {
    try {
        initMessageBird();
    } catch {
        return;
    }
    const params = {
        originator: "+31638643409",
        recipients: config.smsRecipients,
        body: text,
    };

    messagebird.messages.create(params, function (err, response) {
        if (err) {
            return console.log(err);
        }
        console.log(response);
    });
};
