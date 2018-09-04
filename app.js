/** Modules **/
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nodeMailer = require('nodemailer');
var reload = require('reload')
var fs = require('fs');
var yaml = require('js-yaml');
const { exec } = require('child_process');
const multer = require('multer');
var uniqueFilename = require('unique-filename');
var rimraf = require('rimraf');

var shortid = require('shortid');

/*** Arrays ***/
var blokkenArray = [];
var blokNamen = [];

var artikelArray = [];
var categorieArray = [];

exports.blokkenAray = [];
var imageArray = [];
var mailArray = [];

/*** Globale Variabelen ***/
module.exports = function() { 
    this.blokken = function() { 
      return getBlokken();
    };
    this.artikels = function() { 
      return getArtikels();
    };
    this.afbeeldingen = imageArray;
    this.blokNamen = function(){
      return getBlokNamen();
    };
    this.categoriën = function(){
      return getCategoriën();
    }
    this.mails = function(){
      return getMails();
    };
}

/** Routes **/
var index = require('./routes/index');
var nieuw = require('./routes/nieuw');
var blokkenRoute = require('./routes/blokken');
var alleBlokken = require('./routes/alleBlokken');
var blokkenName = require('./routes/blokkenName');
var instellingen = require('./routes/instellingen');
var routeDelete = require('./routes/delete');
var media = require('./routes/media');
var mail = require('./routes/mail');
var nieuwArtikel = require('./routes/nieuwArtikel');
var alleArtikels = require('./routes/alleArtikels');
var nieuwCategorie = require('./routes/nieuwCategorie');

/*** Locaties mappen met data ***/
const postsFolder = './public/data/blokken/';
const categorieFolder = './public/data/artikels/Categorie/';
const artikelFolder = './public/data/artikels/';
const imageFolder = './public/images/';
const mailFolder = './public/data/mail/';

fs.readdirSync(imageFolder).forEach(file => {
  if (file.toString().slice(-4) === ".jpg" || file.toString().slice(-4) === ".jpeg" || file.toString().slice(-4) === ".png" || file.toString().slice(-4) === ".gif") {
    imageArray.push(file);
  }
});








/** Express oproepen **/
var app = express();
reloadServer = reload(app);

/** Config file (yaml) **/
var configYaml = yaml.load(fs.readFileSync('config.yml', {encoding: 'utf-8'}));


var blokken = [];

/** Posts array **/





var posts = {
  posts: [
  ]
};

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/images/',
  filename: function(req, file, cb){
    cb(null,file.originalname);
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');






// view engine setup
app.set('views', path.join(__dirname, '/views/' + configYaml.thema));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/blokken', blokkenRoute);
app.use('/instellingen', instellingen);
app.use('/media', media);
app.use('/new', nieuw);
app.use('/alleBlokken', alleBlokken);
app.use('/mail', mail);
app.use('/nieuwArtikel', nieuwArtikel);
app.use('/alleArtikels', alleArtikels);
app.use('/nieuwCategorie', nieuwCategorie);

app.get('/artikels/:name', function(req, res, next){
  var yml = yaml.load(fs.readFileSync('./public/data/artikels/' + req.params.name.replace(/\s/g,'') + '.yml', {encoding: 'utf-8'}));
  var alleCategoriën = getCategoriën();
  var configYaml = yaml.load(fs.readFileSync('config.yml', {encoding: 'utf-8'}));
  var content = fs.readFileSync("./public/data/artikels/HTML/" + req.params.name.replace(/\s/g,'') + ".html","utf-8");
  res.render('nieuwArtikel', {
    artikel: yml,
    config: configYaml,
    categoriën: getCategoriën(),
    html: content,
    categoriën: alleCategoriën,
    images: imageArray,
    nieuw: "false"
  });
  
});
app.get('/blokken/:name', function(req, res, next){
  var yml = yaml.load(fs.readFileSync('./public/data/blokken/' + req.params.name.replace(/\s/g,'') + '.yml', {encoding: 'utf-8'}));
  var configYaml = yaml.load(fs.readFileSync('config.yml', {encoding: 'utf-8'}));
  var json = '{"kolommen": []}';
  console.log(yml);
  if (yml.bloktype != "contact" && yml.bloktype != "kolom" && yml.bloktype != "artikel") {
    var content = fs.readFileSync("./public/data/blokken/HTML/" + req.params.name.replace(/\s/g,'') + ".html","utf-8");
  } else if (yml.bloktype == "kolom") {
    for(var i = 0; i < yml.kolomen.length; i++){
      var obj = JSON.parse(json);
      var content = fs.readFileSync("./public/data/blokken/HTML/" + req.params.name.replace(/\s/g,'') + "/" + yml.kolomen[i].beschrijving + ".html","utf-8");
      obj['kolommen'].push({"naam": yml.kolomen[i].beschrijving,"html": content});
      json = JSON.stringify(obj);
    }
    
    console.log(json);
  }

    res.render('nieweBlok', {
      test: req.query.type,
      titelcolor: '#323232',
      backgroundcolor: '#ffffff',
      tekstcolor: '#323232',
      images: imageArray,
      blokkenArray: getBlokNamen(),
      tweedeTest: "herwerk",
      blok: yml,
      html: content,
      nieuw: "false",
      config: configYaml,
      categoriën: getCategoriën()
    });    
});
app.get('/deleteCategorie/:naam', function(req,res,next){
  var categoriën = getCategoriën();
  console.log(req.params.naam);
  
  var search_term = req.params.naam;

  for (var i=categoriën.categoriën.length-1; i>=0; i--) {
    if (categoriën.categoriën[i] === search_term) {
        categoriën.categoriën.splice(i, 1);
        // break;       //<-- Uncomment  if only the first term has to be removed
    }
  }
  var wstream = fs.createWriteStream(categorieFolder + 'categoriën.yml');
  wstream.write('categoriën: ' + '\n');
  for (i = 0; i < categoriën.categoriën.length; i++) {
    wstream.write('  - ' + categoriën.categoriën[i] + '\n');
  }
  wstream.end();

  res.redirect("/nieuwCategorie");

});
app.get('/delete/:id', function(req,res,next){
  var alleBlokken = getBlokken();
  var blokNamen = getBlokNamen();
  var listToDelete = [];
  var item = alleBlokken.find(item => item.id == req.params.id);
  console.log(item);

  
  listToDelete.push(item.id);
  for(var i = 0; i < alleBlokken.length; i++) {
    if (alleBlokken[i].id == item.id){
      if (alleBlokken[i].bloktype === "kolom"){
        rimraf('./public/data/blokken/HTML/' + item.name.replace(/\s/g,''), function () { console.log('done'); });
        fs.unlinkSync('./public/data/blokken/' + item.name.replace(/\s/g,'') + '.yml');
      } else if(alleBlokken[i].bloktype === "contact" || alleBlokken[i].bloktype === "artikel") {
        fs.unlinkSync('./public/data/blokken/' + item.name.replace(/\s/g,'') + '.yml');
      } else {
        fs.unlinkSync('./public/data/blokken/' + item.name.replace(/\s/g,'') + '.yml');
        fs.unlinkSync('./public/data/blokken/HTML/' + item.name.replace(/\s/g,'') + '.html');
      }
    }

    
    if (alleBlokken[i].id > req.params.id) {

      if (alleBlokken[i].bloktype == "afbeelingEnTekst") {
        var wstream = fs.createWriteStream(postsFolder + alleBlokken[i].name.replace(/\s/g,'') + '.yml');
        wstream.write('name: ' + alleBlokken[i].name + '\n');
        wstream.write('titel: ' + alleBlokken[i].titel + '\n');
        wstream.write('afbeelding: ' + alleBlokken[i].afbeelding + '\n');
        wstream.write('html: ' + alleBlokken[i].html + '\n');
        wstream.write('bloktype: ' + alleBlokken[i].bloktype + '\n');
        wstream.write('backgroundColor: ' + `'${alleBlokken[i].backgroundColor}'` + '\n');
        wstream.write('titelColor: ' + `'${alleBlokken[i].titelColor}'` + '\n');
        wstream.write('tekstColor: ' + `'${alleBlokken[i].tekstColor}'` + '\n');
        wstream.write('id: ' + `${alleBlokken[i].id - 1}` + '\n');
        wstream.write('checked: ' + alleBlokken[i].checked + '\n');
        wstream.write('achtergrondafbeelding: ' +   alleBlokken[i].achtergrondafbeelding);
        wstream.end();
      } else if (alleBlokken[i].bloktype == "tekst") {
        var wstream = fs.createWriteStream(postsFolder + alleBlokken[i].name.replace(/\s/g,'') + '.yml');
        wstream.write('name: ' + alleBlokken[i].name + '\n');
        wstream.write('titel: ' + alleBlokken[i].titel + '\n');
        wstream.write('html: ' + alleBlokken[i].html + '\n');
        wstream.write('bloktype: ' + alleBlokken[i].bloktype + '\n');
        wstream.write('backgroundColor: ' + `'${alleBlokken[i].backgroundColor}'` + '\n');
        wstream.write('titelColor: ' + `'${alleBlokken[i].titelColor}'` + '\n');
        wstream.write('tekstColor: ' + `'${alleBlokken[i].tekstColor}'` + '\n');
        wstream.write('backgroundImage: ' + alleBlokken[i].backgroundImage + '\n');
        wstream.write('checked: ' + alleBlokken[i].checked + '\n');
        wstream.write('id: ' + `${alleBlokken[i].id - 1}` + '\n');
        wstream.end(); 
      } else if (alleBlokken[i].bloktype == "contact") {
     
        var wstream = fs.createWriteStream(postsFolder + alleBlokken[i].name.replace(/\s/g,'') + '.yml');
        wstream.write('name: ' + alleBlokken[i].name + '\n');
        wstream.write('titel: ' + alleBlokken[i].titel + '\n');
        wstream.write('gsmNr: ' + alleBlokken[i].gsmNr + '\n');
        wstream.write('telNr: ' + alleBlokken[i].telNr + '\n');
        wstream.write('adres: ' + alleBlokken[i].adres + '\n');
        wstream.write('emailAdres: ' + `'${alleBlokken[i].emailAdres}'` + '\n');
        wstream.write('backgroundColor: ' + `'${alleBlokken[i].backgroundColor}'` + '\n');
        wstream.write('kleurContactgegevens: ' + `'${alleBlokken[i].kleurContactgegevens}'` + '\n');
        wstream.write('titelColor: ' + `'${alleBlokken[i].titelColor}'` + '\n');
        wstream.write('tekstColor: ' + `'${alleBlokken[i].tekstColor}'` + '\n');
        wstream.write('iconAchterColor: ' + `'${alleBlokken[i].iconAchterColor}'` + '\n');
        wstream.write('iconColor: ' + `'${alleBlokken[i].iconColor}'` + '\n');
        wstream.write('backgroundImage: ' + alleBlokken[i].backgroundImage + '\n');
        wstream.write('checked: ' + alleBlokken[i].checked + '\n');
        wstream.write('id: ' + `${alleBlokken[i].id - 1}` + '\n');
        wstream.write('bloktype: contact');
        wstream.end();
      } else if (alleBlokken[i].bloktype == "kolom") {
        var wstream = fs.createWriteStream(postsFolder + alleBlokken[i].name.replace(/\s/g,'') + '.yml');
  wstream.write('name: ' + alleBlokken[i].name + '\n');
  wstream.write('titel: ' + alleBlokken[i].titel + '\n');
  wstream.write('backgroundColor: ' + `'${alleBlokken[i].backgroundColor}'` + '\n');
  wstream.write('backgroundColorKolom: ' + `'${alleBlokken[i].backgroundColorKolom}'` + '\n');
  wstream.write('titelColor: ' + `'${alleBlokken[i].titelColor}'` + '\n');
  wstream.write('titelKleurKolom: ' + `'${alleBlokken[i].titelKleurKolom}'` + '\n');
  wstream.write('tekstKleurKolom: ' + `'${alleBlokken[i].tekstKleurKolom}'` + '\n');
  wstream.write('backgroundImage: ' + alleBlokken[i].backgroundImage + '\n');
  wstream.write('checked: ' + alleBlokken[i].checked + '\n');
  wstream.write('bloktype: kolom' + '\n');
  wstream.write('id: ' + `${alleBlokken[i].id - 1}` + '\n');
  wstream.write('kolomen:' + '\n');
  for (k = 0; k < alleBlokken[i].kolomen.length; k++) {
    wstream.write('  - titel: ' + alleBlokken[i].kolomen[k].titel + '\n'+ '    beschrijving: ' + alleBlokken[i].kolomen[k].beschrijving + '\n' + '    afbeelding: ' + alleBlokken[i].kolomen[k].afbeelding + '\n' );
  }
  wstream.end();
      } else if (alleBlokken[i].bloktype == "video") {
        var wstream = fs.createWriteStream(postsFolder + alleBlokken[i].name.replace(/\s/g,'')+ '.yml');
        wstream.write('name: ' + alleBlokken[i].name + '\n');
        wstream.write('titel: ' + alleBlokken[i].titel + '\n');
        wstream.write('videoID: ' + alleBlokken[i].videoID + '\n');
        wstream.write('html: ' + alleBlokken[i].html + '\n');
        wstream.write('bloktype: ' + alleBlokken[i].bloktype + '\n');
        wstream.write('id: ' + `${alleBlokken[i].id - 1}` + '\n');
        wstream.write('backgroundColor: ' + `'${alleBlokken[i].backgroundColor}'` + '\n');
        wstream.write('titelColor: ' + `'${alleBlokken[i].titelColor}'` + '\n');
        wstream.write('tekstColor: ' +  `'${alleBlokken[i].tekstColor}'` + '\n');
        wstream.write('backgroundImage: ' + alleBlokken[i].backgroundImage + '\n');
        wstream.end(); 
       
      }
      else if (alleBlokken[i].bloktype == "artikel") {
        var wstream = fs.createWriteStream(postsFolder + alleBlokken[i].name.replace(/\s/g,'') + '.yml');
        wstream.write('name: ' + alleBlokken[i].name  + '\n');
        wstream.write('titel: ' + alleBlokken[i].titel + '\n');
        wstream.write('categorie: ' + alleBlokken[i].categorie + '\n');
        wstream.write('bloktype: ' + 'artikel' + '\n');
        wstream.write('id: ' + `${alleBlokken[i].id - 1}` + '\n');
        wstream.end(); 
       
      }
      
      alleBlokken[i].id = alleBlokken[i].id - 1;
    
  } 
  }


  res.redirect('/blokken');
})

app.get('/deleteArtikel/:name', function(req,res,next){
 

  fs.unlinkSync('./public/data/artikels/' + req.params.name + '.yml');
  fs.unlinkSync('./public/data/artikels/HTML/' + req.params.name + '.html');
  
  


  res.redirect('/alleArtikels');
})

app.post("/instellingenOpslaan", function (req, res, next) {
 
  fs.writeFileSync("config.yml",
`sitename: ${req.body.title}
auteur: ${req.body.auteur}
headerImage: ${req.body.headerImage}
slogan: ${req.body.slogan}
logo: ${req.body.logo}
thema: ${req.body.thema}`
        );
  app.set('views', path.join(__dirname, '/views/' + req.body.thema));
  var configYaml = yaml.load(fs.readFileSync('config.yml', {encoding: 'utf-8'}));
    res.redirect('/instellingen');
});


/*** AANMAKEN VAN BLOKKEN ***/
// Aanmaken Tekst Blok
app.post("/makeTekst", function (req, res, next) { 
  // Ophalen blokken voor lengte (id)
  var alleBlokken = getBlokken();
  var ID = alleBlokken.length + 1;
  // Controle of chechbox is gechecked of niet
  var checked;
  if (req.body.checkbox == "on") {
    checked = "true";
  } else {
    checked = "false";
  }
  if (req.body.type === "herwerk" && req.body.naam !== req.body.huidigeNaam) {
    fs.unlink('./public/data/blokken/' + req.body.huidigeNaam + ".yml", (err) => {
      if (err) throw err;
    });
    fs.unlink('./public/data/blokken/HTML/' + req.body.huidigeNaam + ".html", (err) => {
      if (err) throw err;
    });
  }

  // Aanmaken YAML file
  var wstream = fs.createWriteStream(postsFolder + req.body.naam.replace(/\s/g,'') + '.yml');
  wstream.write('name: ' + req.body.naam + '\n');
  wstream.write('titel: ' + req.body.titel + '\n');
  wstream.write('html: ' + req.body.naam.replace(/\s/g,'') + '\n');
  wstream.write('bloktype: ' + req.body.blokType + '\n');
  wstream.write('backgroundColor: ' + `'${req.body.backgroundcolor}'` + '\n');
  wstream.write('titelColor: ' + `'${req.body.titelcolor}'` + '\n');
  wstream.write('tekstColor: ' + `'${req.body.tekstcolor}'` + '\n');
  wstream.write('backgroundImage: ' + req.body.afbeelding1 + '\n');
  wstream.write('checked: ' + checked + '\n');
  if (req.body.type === "nieuw") {
    wstream.write('id: ' + ID + '\n');
  } else {
    wstream.write('id: ' + req.body.ID + '\n');
  }
  wstream.end();

  // Aanmaken HTML file
  fs.writeFileSync("./public/data/blokken/HTML/" + req.body.naam.replace(/\s/g,'') + ".html",
    `${req.body.text}`
  );

  // Naam in blokkenAray pushen voor controle of naam al bestaat    
  module.exports.blokTitel = req.body.naam;

  // Navigeren naar all blokken
  res.redirect('/blokken'); 
});

// Aanmaken afbeelding en tekst blok
app.post("/makeAfbeeldingEnTekst", function (req, res, next) {
  // Ophalen blokken voor lengte (id)
  var alleBlokken = getBlokken();
  var ID = alleBlokken.length + 1;
  // Controle of chechbox is gechecked of niet
  var checked;
  if (req.body.checkbox == "on") {
    checked = "true";
  } else {
    checked = "false";
  }
  if (req.body.type === "herwerk" && req.body.naam !== req.body.huidigeNaam) {
    fs.unlink('./public/data/blokken/' + req.body.huidigeNaam.replace(/\s/g,'') + ".yml", (err) => {
      if (err) throw err;
    });
    fs.unlink('./public/data/blokken/HTML/' + req.body.huidigeNaam.replace(/\s/g,'') + ".html", (err) => {
      if (err) throw err;
    });
  }
  console.log(req.body.afbeelding1);
  // Aanmaken YAML file
  var wstream = fs.createWriteStream(postsFolder + req.body.naam.replace(/\s/g,'') + '.yml');
  wstream.write('name: ' + req.body.naam + '\n');
  wstream.write('titel: ' + req.body.titel + '\n');
  wstream.write('afbeelding: ' + req.body.afbeelding1 + '\n');
  wstream.write('html: ' + req.body.naam.replace(/\s/g,'') + '\n');
  wstream.write('bloktype: ' + req.body.blokType + '\n');
  wstream.write('backgroundColor: ' + `'${req.body.backgroundcolor}'` + '\n');
  wstream.write('titelColor: ' + `'${req.body.titelcolor}'` + '\n');
  wstream.write('tekstColor: ' +  `'${req.body.tekstcolor}'` + '\n');
  if (req.body.type === "nieuw") {
    wstream.write('id: ' + ID + '\n');
  } else {
    wstream.write('id: ' + req.body.ID + '\n');
  }  
  wstream.write('checked: ' + checked + '\n');
  wstream.write('achtergrondafbeelding: ' + req.body.afbeelding2);
  wstream.end();

  // Aanmaken html file
  fs.writeFileSync("./public/data/blokken/HTML/" + req.body.naam.replace(/\s/g,'') + ".html",
    `${req.body.text}`
  );

  // Naam in blokkenAray pushen voor controle of naam al bestaat
  exports.blokkenAray.push(req.body.name);

  // Navigeren naar alle blokken
  res.redirect('/blokken');  
});

// Aanmaken van contact blok
app.post("/makeContact", function (req, res, next) {
  // Ophalen blokken voor lengte (id)
  var alleBlokken = getBlokken();
  var ID = alleBlokken.length + 1;
  var checked;
  if (req.body.checkbox == "on") {
    checked = "true";
  } else {
    checked = "false";
  }

  if (req.body.type === "herwerk" && req.body.naam !== req.body.huidigeNaam) {
    fs.unlink('./public/data/blokken/' + req.body.huidigeNaam + ".yml", (err) => {
      if (err) throw err;
    });
  }
  // Aanmaken YAML file
  var wstream = fs.createWriteStream(postsFolder + req.body.naam.replace(/\s/g,'') + '.yml');
  wstream.write('name: ' + req.body.naam + '\n');
  wstream.write('titel: ' + req.body.titel + '\n');
  wstream.write('gsmNr: ' + req.body.gsmNr + '\n');
  wstream.write('telNr: ' + req.body.telNr + '\n');
  wstream.write('adres: ' + req.body.adres + '\n');
  wstream.write('emailAdres: ' + `'${req.body.emailAdres}'` + '\n');
  wstream.write('backgroundColor: ' + `'${req.body.backgroundcolor}'` + '\n');
  wstream.write('kleurContactgegevens: ' + `'${req.body.contactgegevensColor}'` + '\n');
  wstream.write('titelColor: ' + `'${req.body.titelcolor}'` + '\n');
  wstream.write('tekstColor: ' + `'${req.body.tekstcolor}'` + '\n');
  wstream.write('iconAchterColor: ' + `'${req.body.iconAchterColor}'` + '\n');
  wstream.write('iconColor: ' + `'${req.body.iconKleur}'` + '\n');
  wstream.write('backgroundImage: ' + req.body.afbeelding1 + '\n');
  wstream.write('checked: ' + checked + '\n');
  if (req.body.type === "nieuw") {
    wstream.write('id: ' + ID + '\n');
  } else {
    wstream.write('id: ' + req.body.ID + '\n');
  }
  wstream.write('bloktype: contact');
  wstream.end();

  // Naam in blokkenAray pushen voor controle of naam al bestaat
  exports.blokkenAray.push(req.body.name);

  // Navigeren naar alle blokken
  res.redirect('/blokken');
});

app.post("/makeVideo", function (req, res, next) { 
  var videoEmbededID = getId(req.body.videoLink);
  var alleBlokken = getBlokken();

  var checked;
  if (req.body.checkbox == "on") {
    checked = "true";
  } else {
    checked = "false";
  }

  var ID = alleBlokken.length + 1;
  if (req.body.type === "herwerk" && req.body.naam !== req.body.huidigeNaam) {
    fs.unlink('./public/data/blokken/' + req.body.huidigeNaam + ".yml", (err) => {
      if (err) throw err;
    });
    fs.unlink('./public/data/blokken/HTML/' + req.body.huidigeNaam + ".html", (err) => {
      if (err) throw err;
    });
  }
  var wstream = fs.createWriteStream(postsFolder + req.body.naam.replace(/\s/g,'') + '.yml');
  wstream.write('name: ' + req.body.naam + '\n');
  wstream.write('titel: ' + req.body.titel + '\n');
  wstream.write('videoID: ' + videoEmbededID + '\n');
  wstream.write('html: ' + req.body.naam.replace(/\s/g,'') + '\n');
  wstream.write('bloktype: ' + req.body.blokType + '\n');
  wstream.write('backgroundColor: ' + `'${req.body.backgroundcolor}'` + '\n');
  wstream.write('titelColor: ' + `'${req.body.titelcolor}'` + '\n');
  wstream.write('tekstColor: ' +  `'${req.body.tekstcolor}'` + '\n');
  wstream.write('backgroundImage: ' + req.body.afbeelding1 + '\n');
  wstream.write('checked: ' + checked + '\n');
  if (req.body.type === "nieuw") {
    wstream.write('id: ' + ID + '\n');
  } else {
    wstream.write('id: ' + req.body.ID + '\n');
  }
  wstream.end(); 
  // Aanmaken html file
  fs.writeFileSync("./public/data/blokken/HTML/" + req.body.naam.replace(/\s/g,'') + ".html",
    `${req.body.text}`
  );
  // Navigeren naar all blokken
  res.redirect('/blokken'); 


  function getId(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) {
        return match[2];
    } else {
        return 'error';
    }
    
    
  }
});

app.post("/makeArtikel", function (req, res, next) { 
  var alleBlokken = getBlokken();
  var ID = alleBlokken.length + 1;
  
  if (req.body.type === "herwerk" && req.body.naam !== req.body.huidigeNaam) {
    fs.unlink('./public/data/blokken/' + req.body.huidigeNaam + ".yml", (err) => {
      if (err) throw err;
    });
  }
  var wstream = fs.createWriteStream(postsFolder + req.body.naam.replace(/\s/g,'') + '.yml');
  wstream.write('name: ' + req.body.naam + '\n');
  wstream.write('titel: ' + req.body.titel + '\n');
  wstream.write('categorie: ' + req.body.categorie + '\n');
  wstream.write('backgroundColor: ' + `'${req.body.backgroundcolor}'` + '\n');
  wstream.write('titelColor: ' + `'${req.body.titelcolor}'` + '\n');
  wstream.write('artikelAchtergrondkleur: ' + `'${req.body.artikelachtergrondcolor}'` + '\n');
  wstream.write('artikelTitelKleur: ' + `'${req.body.artikeltitelcolor}'` + '\n');
  wstream.write('tekstColor: ' + `'${req.body.tekstcolor}'` + '\n');
  wstream.write('bloktype: ' + 'artikel' + '\n');

  if (req.body.type === "nieuw") {
    wstream.write('id: ' + ID + '\n');
  } else {
    wstream.write('id: ' + req.body.ID + '\n');
  }
  wstream.end(); 
  
  // Navigeren naar all blokken
  res.redirect('/blokken'); 


  function getId(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) {
        return match[2];
    } else {
        return 'error';
    }
    
    
  }
});
// Aanmaken van kolom blok
app.post("/makeKolom", function (req, res, next) {
  // Ophalen blokken voor lengte (id)
  var alleBlokken = getBlokken();
  var ID = alleBlokken.length + 1;

  var checked;
  if (req.body.checkbox == "on") {
    checked = "true";
  } else {
    checked = "false";
  }
  // Locatie voor alle diensten files (html)
  var dir = './public/data/blokken/HTML/' + req.body.naam.replace(/\s/g,'') ;

  // Controleren of map al dan niet bestaat
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
  console.log(req.body.type);
  console.log(req.body.huidigeNaam);
  if (req.body.type === "herwerk" && req.body.naam !== req.body.huidigeNaam) {
    console.log("kaka");
    fs.unlink('./public/data/blokken/' + req.body.huidigeNaam + ".yml", (err) => {
      if (err) throw err;
    });
    rimraf('./public/data/blokken/HTML/' + req.body.huidigeNaam.replace(/\s/g,''), function () { console.log('done'); });
  }

  // Aanmaken YAML file
  var wstream = fs.createWriteStream(postsFolder + req.body.naam.replace(/\s/g,'') + '.yml');
  wstream.write('name: ' + req.body.naam + '\n');
  wstream.write('titel: ' + req.body.blokTitel + '\n');
  wstream.write('backgroundColor: ' + `'${req.body.backgroundcolor}'` + '\n'); 
  wstream.write('backgroundColorKolom: ' + `'${req.body.backgroundcolorKolom}'` + '\n'); 
  wstream.write('titelColor: ' + `'${req.body.titelcolor}'` + '\n'); 
  wstream.write('titelKleurKolom: ' + `'${req.body.titelcolorkolom}'` + '\n'); 
  wstream.write('tekstKleurKolom: ' + `'${req.body.tekstcolorkolom}'` + '\n');
  wstream.write('backgroundImage: ' + req.body.afbeelding1 + '\n');
  wstream.write('checked: ' + checked + '\n');
  wstream.write('bloktype: kolom' + '\n');
  if (req.body.nieuw === "true") {
    wstream.write('id: ' + ID + '\n');
  } else {
    wstream.write('id: ' + req.body.ID + '\n');
  }
  wstream.write('kolomen:' + '\n');
  for (i = 0; i < req.body.titel.length; i++) {
    wstream.write('  - titel: ' + req.body.titel[i] + '\n'+ '    beschrijving: ' + req.body.naam.replace(/\s/g,'') + i + '\n' + '    afbeelding: ' + req.body.afbeelding[i] + '\n' );
  }
  wstream.end();

  // Aanmaken HTML files
  for (i = 0; i < req.body.titel.length; i++) {
    fs.writeFileSync("./public/data/blokken/HTML/" + req.body.naam.replace(/\s/g,'') + "/" + req.body.naam.replace(/\s/g,'') + i + ".html",
    `${req.body.beschrijving[i]}`
    );
  }

  // Navigeren naar alle blokken
  res.redirect('/blokken');
});

/*** MEDIA ***/
app.post("/nieuwArtikel", function (req, res, next) {
  if (req.body.type === "herwerk" && req.body.naam !== req.body.huidigeNaam) {
    fs.unlink('./public/data/artikels/' + req.body.huidigeNaam + ".yml", (err) => {
      if (err) throw err;
    });
    fs.unlink('./public/data/artikels/HTML/' + req.body.huidigeNaam + ".html", (err) => {
      if (err) throw err;
    });
  }

  /** Date of today **/
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  if(dd<10) { 
    dd = '0'+dd
  } 

  if(mm<10) {
    mm = '0'+mm
  } 

  today = dd + '/' + mm + '/' + yyyy;
  
  var tijd = new Date();
  var uur = tijd.getHours(); // => 9
  var min = tijd.getMinutes(); // =>  30
  var sec = tijd.getSeconds(); // => 51
  tijd = uur + ':' + min +':'+ sec;

  var wstream = fs.createWriteStream(artikelFolder + req.body.artikelNaam.replace(/\s/g,'') + '.yml');
  wstream.write('naam: ' + req.body.artikelNaam + '\n');
  wstream.write('titel: ' + req.body.titel + '\n');
  wstream.write('categorie: ' + req.body.categorie + '\n');
  wstream.write('html: ' + req.body.artikelNaam.replace(/\s/g,'') + '\n');
  wstream.write('afbeelding: ' + req.body.afbeelding1 + '\n');
  wstream.write('datum: ' + today + '\n');
  wstream.write('tijd: ' + tijd + '\n');
  wstream.end();

  fs.writeFileSync("./public/data/artikels/HTML/" + req.body.artikelNaam.replace(/\s/g,'') + ".html",
    `${req.body.text}`
  );
  res.redirect('/alleArtikels');
});

app.post("/nieuwCategorie", function (req, res, next) {
  var categoriën = getCategoriën();
  // Aanmaken YAML file
  categoriën.categoriën.push(req.body.categorie);
 
  var wstream = fs.createWriteStream(categorieFolder + 'categoriën.yml');
  wstream.write('categoriën: ' + '\n');
  for (i = 0; i < categoriën.categoriën.length; i++) {
    wstream.write('  - ' + categoriën.categoriën[i] + '\n');
  }
  wstream.end();


  // Navigeren naar alle blokken
  res.redirect('/nieuwCategorie');
});
// Uploaden afbeelding in Media
app.post('/uploadImage', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.render('media', {
        msg: err,
        images: imageArray
      });
    } else {      
      imageArray.push(req.file.originalname);
      res.redirect('/media');
    }
  });
});

// Afbeelding verwijderen
app.get('/deleteImg/:image', function(req,res,next){
  var item = imageArray.find(item => item == req.params.image);
  fs.unlinkSync('./public/images/' + item);
  var i = imageArray.indexOf(item);
  if(i != -1) {
    imageArray.splice(i, 1);
  } 
  res.redirect('/media');
})


/*** MAIL ***/

// Verzenden van mail
app.post("/verzendMail", function (req, res, next) {
  /** Date of today **/
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  if(dd<10) { 
    dd = '0'+dd
  } 

  if(mm<10) {
    mm = '0'+mm
  } 

  today = dd + '/' + mm + '/' + yyyy;
  var name = shortid.generate();
  fs.writeFileSync("./public/data/mail/" + 'mail' + name  + ".yml",
`naam: ${'mail' + name}
naamVerzender: ${req.body.naam}
onderwerp: ${req.body.onderwerp}
emailAdres: ${req.body.emailAdres}
status: ongelezen
datum: ${today}`
        );
  fs.writeFileSync("./public/data/mail/HTML/" + "mail" + name + ".html",
    `${req.body.bericht}`
        );

  res.redirect('/');
});
// Detailpagina emial 
app.get('/mail/:name', function(req, res, next){
  var yml = yaml.load(fs.readFileSync('./public/data/mail/' + req.params.name.replace(" ", "") + '.yml', {encoding: 'utf-8'}));
  var content = fs.readFileSync("./public/data/mail/HTML/" + req.params.name.replace(" ", "") + ".html","utf-8");;
    res.render('detailmail', {
      mail: yml,
      html: content,
      type: req.query.type,
      config: configYaml
    }); 
});
 
/*** Alle functies ***/

// Ophalen alle blokken
function getBlokken() {
  blokkenArray = [];
  blokNamen =[];
    fs.readdirSync(postsFolder).forEach(file => {
      if(file.toString().slice(-4) === ".yml") {
        var obj = yaml.load(fs.readFileSync(postsFolder + file, {encoding: 'utf-8'}));
        blokkenArray.push(obj);
        blokNamen.push(obj.name);
      }
    });
  blokkenArray.sort(function(a, b) { 
    return (a.id - b.id) || a.name.localeCompare(b.name); 
  });
  return blokkenArray;
}

// Ophalen alle artikels
function getArtikels() {
  artikelArray = [];
  fs.readdirSync(artikelFolder).forEach(file => {
    if(file.toString().slice(-4) === ".yml") {
      var obj = yaml.load(fs.readFileSync(artikelFolder + file, {encoding: 'utf-8'}));
      artikelArray.push(obj);
    }
  });
  artikelArray.sort(function(a,b){
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(b.datum) - new Date(a.datum);
  });
  return artikelArray;
}

// Ophalen alle bloknamen
function getBlokNamen() {
  blokNamen =[];
    fs.readdirSync(postsFolder).forEach(file => {
      if(file.toString().slice(-4) === ".yml") {
        var obj = yaml.load(fs.readFileSync(postsFolder + file, {encoding: 'utf-8'}));
        blokNamen.push(obj.name);
      }
    });
  return blokNamen;
}
function getCategoriën() {
  var categoriën = yaml.load(fs.readFileSync(categorieFolder + 'categoriën.yml', {encoding: 'utf-8'}));
  return categoriën;
}

function getMails() {
  mailArray =[];
    fs.readdirSync(mailFolder).forEach(file => {

  if (file.toString().slice(-4) === ".yml") {
    var obj = yaml.load(fs.readFileSync(mailFolder + file, {encoding: 'utf-8'}));
    mailArray.push(obj);
  }
  
});
    console.log(mailArray);
  return mailArray;
}


// Check fileType media
function checkFileType(file, cb){
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    fs.exists(imageFolder + file.originalname, function(exists) {
      let uploadedFileName;
      if (exists) {
        cb('Error: Naam afbeelding bestaat al!');
      } else {
        return cb(null,true);
      } 
    });
    
  } else {
    cb('Error: Images Only!');
  }
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
