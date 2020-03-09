const http = require('http');
const fetch = require('node-fetch');
const request = require('request').defaults({ encoding: null });
const fs = require('fs');
const vision = require('@google-cloud/vision');

const path = 'http://hague.kdmid.ru/queue/CodeImage.aspx?id=c646';
request.get(path, function (error, response, body) {
    let data;
    if (!error && response.statusCode === 200) {
        data = "data:" + response.headers["content-type"] + ";base64," + new Buffer.from(body).toString('base64');
        let base64Image = data.split(';base64,').pop();

        fs.writeFile('magicNumbers.png', base64Image, {encoding: 'base64'}, function(err) {


            async function quickstart() {
                // Creates a client
                const client = new vision.ImageAnnotatorClient();

                const fileName = 'magicNumbers.png';

                // Performs text detection on the local file
                const [result] = await client.textDetection(fileName);
                const detections = result.textAnnotations;
                console.log(detections[0].description);
                // console.log('Text:');
                // detections.forEach(text => console.log(text));
            }

            quickstart();

        });

    }
});


/*
(function(){var script = document.createElement("script"); script.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"); script.addEventListener('load', function() { var script = document.createElement("script"); document.body.appendChild(script); console.log('jQuery injected');}, false); document.body.appendChild(script)})()


$("#ctl00_MainContent_txtID").val('38704');
$("#ctl00_MainContent_txtUniqueID").val('24E6A7C7');

*/