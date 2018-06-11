var express = require('express');
var router = express.Router();
var yaml = require('js-yaml');
var fs = require('fs');
var configYaml = yaml.load(fs.readFileSync('config.yml', {encoding: 'utf-8'}));

var blokkenAray = [];
const imageFolder = './public/images/';
var blokTitel = "";
var blokken = [];
var imageAray = [];
const postsFolder = './public/data/blokken/';


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('blokken', {
    	blokken: blokken
    });
});

router.get('/blokken/:name', function(req, res, next) {
    var yml = yaml.load(fs.readFileSync('./public/data/blokken/' + req.params.name.replace(" ", "") + '.yml', {encoding: 'utf-8'}));
    var content = fs.readFileSync("./public/data/blokken/HTML/" + req.params.name.replace(" ", "") + ".html","utf-8");;


  
    res.render('blok', {
      blok: yml,
      html: content
    }); 
});


module.exports = router;