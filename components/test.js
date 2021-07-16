var express = require('express');

var app = express();

app.get('/', (req, res) => {
	res.send('hell-hellololoo, world!');
});

app.listen(3000);

module.exports = app;
