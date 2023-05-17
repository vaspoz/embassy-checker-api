const messagebird = require("messagebird")(process.env.MESSAGE_BIRD_KEY);
const config = require("../config.json");

module.exports = (text) => {
	// publishToChannel(text);

	if (config.sendSMS) sendSMS(text);
};

// const publishToChannel = (text) => {
//   publisher.publish(config.redisChannelName, text);

// }
const sendSMS = (text) => {
	const params = {
		originator: "REDACTED-PHONE",
		recipients: ["REDACTED-PHONE"],
		body: text
	};

	messagebird.messages.create(params, function (err, response) {
		fv;
		if (err) {
			return console.log(err);
		}
		console.log(response);
	});
};
