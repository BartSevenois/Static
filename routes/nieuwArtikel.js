var express = require('express');
var router = express.Router();
var yaml = require('js-yaml');
var fs = require('fs');

var bool = true;

require('../app.js')();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var alleCategoriën = categoriën();
  var configYaml = yaml.load(fs.readFileSync('config.yml', {encoding: 'utf-8'}));
    res.render('nieuwArtikel', {
      config: configYaml,
      categoriën: alleCategoriën,
      artikel: 'undefined',
      html: 'undefined',
      images: afbeeldingen,
      nieuw: "true"
    });
});



module.exports = router;