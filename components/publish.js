const messagebird = require("messagebird").initClient(
	process.env.MESSAGEBIRD_API_KEY
);
const config = require("../config.json");

module.exports = (text) => {
	if (config.sendSMS) sendSMS(text);
};

const sendSMS = (text) => {
	const params = {
		originator: "+31638643409",
		recipients: config.smsRecipients,
		body: text
	};

	messagebird.messages.create(params, function (err, response) {
		if (err) {
			return console.log(err);
		}
		console.log(response);
	});
};
