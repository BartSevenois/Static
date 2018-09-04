var express = require('express');
var router = express.Router();
var yaml = require('js-yaml');
var fs = require('fs');

var bool = true;

require('../app.js')();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("kaka");
  var alleArtikels = artikels();
  console.log(alleArtikels);
  var configYaml = yaml.load(fs.readFileSync('config.yml', {encoding: 'utf-8'}));
    res.render('alleArtikels', {
      config: configYaml,
      artikels: alleArtikels
    });
});



module.exports = router;