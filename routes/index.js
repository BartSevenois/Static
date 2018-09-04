var express = require('express');
var fs = require("fs");
var router = express.Router();
var yaml = require('js-yaml');


require('../app.js')();

/* GET home page. */
router.get('/', function(req, res, next) { 
  var alleBlokken = blokken();
  var alleArtikels = artikels();
  var configYaml = yaml.load(fs.readFileSync('config.yml', {encoding: 'utf-8'}));
  console.log(alleBlokken);
  res.render('index', {
      config: configYaml,
      bloks: alleBlokken,
      artikels: alleArtikels
    })
});


module.exports = router;
