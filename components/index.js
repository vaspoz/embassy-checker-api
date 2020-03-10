const request = require('request').defaults({encoding: null});
const fs = require('fs');
const vision = require('@google-cloud/vision');

module.exports.fromLink = (path, callback) => {

    if (!path) {
        path = 'http://hague.kdmid.ru/queue/CodeImage.aspx?id=c646';
    }

    request.get(path, function (error, response, body) {
        let base64Image = new Buffer.from(body).toString('base64');
        fs.writeFile('components/images/magicNumbers.png', base64Image, {encoding: 'base64'}, () => {

            const client = new vision.ImageAnnotatorClient();
            const fileName = 'components/images/magicNumbers.png';

            client.textDetection(fileName)
                .then(([result]) => {
                    callback(result.textAnnotations[0].description);
                });
        });
    });
};

module.exports.fromFile = (fileName, callback) => {
    const client = new vision.ImageAnnotatorClient();

    client.textDetection(fileName)
        .then(([result]) => {
            callback(result.textAnnotations[0].description);
        });
};