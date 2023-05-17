const request = require("request").defaults({ encoding: null });
const fs = require("fs");
const vision = require("@google-cloud/vision");
const path = require("path");

module.exports.fromLink = (link, callback) => {
	if (!link) {
		link = "http://hague.kdmid.ru/queue/CodeImage.aspx?id=c646";
	}

	request.get(link, function (error, response, body) {
		let base64Image = new Buffer.from(body).toString("base64");
		fs.writeFile(
			path.join(__dirname, "images/magicNumbers.png"),
			base64Image,
			{ encoding: "base64" },
			() => {
				const client = new vision.ImageAnnotatorClient();
				const fileName = path.join(
					__dirname,
					"images/magicNumbers.png"
				);

				client.textDetection(fileName).then(([result]) => {
					callback(result.textAnnotations[0].description);
				});
			}
		);
	});
};

module.exports.fromFile = async (fileName, callback) => {
	const client = new vision.ImageAnnotatorClient();

	// Delay is needed because the magicNumbers takes time to be written as a file
	await delay(1000);

	client
		.textDetection(fileName)
		.then(([result]) => {
			callback(result.textAnnotations[0].description);
		})
		.catch((error) => {
			console.log("[ERROR] " + error);
		});
};

function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
