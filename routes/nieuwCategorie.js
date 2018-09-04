var express = require('express');
var router = express.Router();
var yaml = require('js-yaml');
var fs = require('fs');

var bool = true;

require('../app.js')();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var alleCategoriën = categoriën();
  console.log(alleCategoriën);
  var configYaml = yaml.load(fs.readFileSync('config.yml', {encoding: 'utf-8'}));
    res.render('nieuwCategorie', {
    	config: configYaml,
    	categoriën: alleCategoriën
    });
});



module.exports = router;