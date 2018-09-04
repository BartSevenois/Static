var express = require('express');
var router = express.Router();
var yaml = require('js-yaml');
var fs = require('fs');


require('../app.js')();

/* GET users listing. */
router.get('/', function(req, res, next) {
	var alleBlokken = blokken();
	var configYaml = yaml.load(fs.readFileSync('config.yml', {encoding: 'utf-8'}));
    res.render('blokken', {
      blokken: alleBlokken,
      config: configYaml
    });
});






module.exports = router;