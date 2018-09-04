var express = require('express');
var router = express.Router();
var yaml = require('js-yaml');
var fs = require('fs');
var path = require("path");
var themas= [];
require('../app.js')();
var p = "./public/stylesheets/"
fs.readdir(p, function (err, files) {
    if (err) {
        throw err;
    }

    files.map(function (file) {
        return path.join(p, file);
    }).filter(function (file) {
        return fs.statSync(file).isDirectory();
    }).forEach(function (file) {
    	var filename = file.replace('public/stylesheets/','');
        themas.push(filename);
    });
    console.log(themas);
});
/* GET users listing. */
router.get('/', function(req, res, next) {
	var configYaml = yaml.load(fs.readFileSync('config.yml', {encoding: 'utf-8'}));

	



    res.render('instellingen', {
    config: configYaml,
    images: afbeeldingen,
    themas: themas
  });
});



module.exports = router;
