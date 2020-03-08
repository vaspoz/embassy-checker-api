const http = require('http');
const fetch = require('node-fetch');
const vision = require('@google-cloud/vision');
const request = require('request').defaults({ encoding: null });
const fs = require('fs');

const path = 'http://hague.kdmid.ru/queue/CodeImage.aspx?id=c646';

request.get(path, function (error, response, body) {
    let data;
    if (!error && response.statusCode === 200) {
        data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
        console.log(data);
        let base64Image = data.split(';base64,').pop();

        fs.writeFile('magicNumbers.png', base64Image, {encoding: 'base64'}, function(err) {
            console.log('File created');
        });

    }
});

/*
async function quickstart() {
    const client = new vision.ImageAnnotatorClient();
    const fileName = 'Local image file, e.g. /path/to/image.png';
    const [result] = await client.textDetection(fileName);
    const detections = result.textAnnotations;
    console.log('Text:');
    detections.forEach(text => console.log(text));
}

async function quickstart() {
    // Imports the Google Cloud client library
    const vision = require('@google-cloud/vision');

    // Creates a client
    const client = new vision.ImageAnnotatorClient();

    // Performs label detection on the image file
    const [result] = await client.labelDetection('./resources/wakeupcat.jpg');
    const labels = result.labelAnnotations;
    console.log('Labels:');
    labels.forEach(label => console.log(label.description));
}

quickstart();
/*
fetch('http://hague.kdmid.ru/queue/queuechng.aspx?ac=chng')
    .then(response => response.text())
    .then(data => {
        const app = http.createServer((request, response) => {

            const root = HTMLParser.parse(data);

            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(root.querySelector('#center-panel').toString());
            response.end();
        });
        app.listen(3000);
    })
    .catch(err => console.error(err));

$("#ctl00_MainContent_txtID").val('38704');
$("#ctl00_MainContent_txtUniqueID").val('24E6A7C7');
*/