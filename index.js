var fs = require('fs');
var path = require('path');

var express = require('express');
var open = require('open');
var multer = require('multer');

var app = express();

var IMAGE_FOLDER = 'images';
var IMAGE_EXTENSION = '.jpg';
var SERVER_PORT = 8080;

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, IMAGE_FOLDER);
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + IMAGE_EXTENSION);
	}
});
var upload = multer({storage: storage});

app.use(express.static('app'));
app.use(express.static('node_modules'));
app.use('/' + IMAGE_FOLDER, express.static(IMAGE_FOLDER));

app.post('/upload', upload.single('image'), function (req, res) {
	res.sendStatus(200);
});

app.get('/' + IMAGE_FOLDER, function (req, res) {
	var images = [];

	fs.readdirSync(IMAGE_FOLDER).forEach(function(image) {
		var extension = path.extname(image),
			basename = path.basename(image, extension);

		if(extension === IMAGE_EXTENSION) {
			images.push({
				url: IMAGE_FOLDER + '/' + image,
				date: new Date(Number(basename))
			});
		}
	});

	res.send(images);
});

app.listen(SERVER_PORT, function () {
	open('http://localhost:' + SERVER_PORT);
});
