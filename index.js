var express = require('express');
var open = require('open');

var app = express();

app.use(express.static('app'));
app.use(express.static('node_modules'));

app.listen(80, function () {
	open('http://localhost/');
});
