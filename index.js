var fs = require('fs');
var path = require('path');

var express = require('express');
var open = require('open');
var bodyParser = require('body-parser');

var app = express();

var IMAGE_FOLDER = 'images';
var IMAGE_EXTENSION = '.jpg';
var SERVER_PORT = 8080;

app.use(bodyParser.json());
app.use(express.static('app'));
app.use(express.static('node_modules'));
app.use('/' + IMAGE_FOLDER, express.static(IMAGE_FOLDER));

app.post('/' + IMAGE_FOLDER, function (req, res) {
	var imagePath = IMAGE_FOLDER + '/' + Date.now() + IMAGE_EXTENSION,
		imageBase64 = req.body.data.replace(/^data:image\/jpeg;base64,/, ''),
		image = new Buffer(imageBase64, 'base64');

	fs.writeFile(imagePath, image, 'base64', function(err) {
		res.sendStatus(err ? 500 : 200);
	});
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
