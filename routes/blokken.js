var express = require('express');
var router = express.Router();
var yaml = require('js-yaml');
var fs = require('fs');
var configYaml = yaml.load(fs.readFileSync('config.yml', {encoding: 'utf-8'}));

require('../app.js')();

/* GET users listing. */
router.get('/', function(req, res, next) {
var alleBlokken = blokken();
    res.render('blokken', {
      blokken: alleBlokken
    });
});






module.exports = router;