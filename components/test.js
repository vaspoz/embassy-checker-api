var express = require('express');

var app = express();

app.get('/', (req, res) => {
	res.send('hello-lolo, world!');
});

app.listen(3000);

module.exports = app;
