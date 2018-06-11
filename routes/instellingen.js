var express = require('express');
var router = express.Router();
var yaml = require('js-yaml');
var fs = require('fs');

require('../app.js')();


/* GET users listing. */
router.get('/', function(req, res, next) {
	var configYaml = yaml.load(fs.readFileSync('config.yml', {encoding: 'utf-8'}));
    res.render('instellingen', {
    config: configYaml,
    images: afbeeldingen
  });
});



module.exports = router;
