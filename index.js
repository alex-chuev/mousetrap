var express = require('express');
var open = require('open');
var multer = require('multer');

var app = express();

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'images');
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '.jpg');
	}
});
var upload = multer({storage: storage});

app.use(express.static('app'));
app.use(express.static('node_modules'));

app.post('/upload', upload.single('image'), function (req, res) {
	res.sendStatus(200);
});

app.listen(80, function () {
	open('http://localhost/');
});
