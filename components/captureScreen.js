// Web Address (URL) of the page to capture
let url = "http://hague.kdmid.ru/queue/queuechng.aspx?ac=chng";

// File name of the captured image
let file = "images/test.png";

let screenshot = require('desktop-screenshot');

screenshot("components/images/screenshot.png", function(error, complete) {
    if(error)
        console.log("Screenshot failed", error);
    else
        console.log("Screenshot succeeded");
});


const Clipper = require('image-clipper');
const Canvas = require('canvas');

Clipper('components/images/screenshot.png', {canvas: Canvas},function() {
    this.crop(20, 20, 100, 100)
        .toFile('components/images/screenshot2.png', function() {
            console.log('saved!');
        });
});
