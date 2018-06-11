var express = require('express');
var router = express.Router();
var yaml = require('js-yaml');
var fs = require('fs');
var configYaml = yaml.load(fs.readFileSync('config.yml', {encoding: 'utf-8'}));
var bool = true;

require('../app.js')();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('nieweBlok', {
  		test: req.query.type,
  		titelcolor: '#323232',
  		backgroundcolor: '#ffffff',
  		tekstcolor: '#323232',
  		images: afbeeldingen,
      blokkenArray: blokNamen(),
      tweedeTest: "nieuw",
      blok: "undefined",
      html: "undefined",
      nieuw: "true"
    });
});



module.exports = router;