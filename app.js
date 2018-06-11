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

exports.blokkenAray = [];
var imageArray = [];
var mailArray = [];

/*** Globale Variabelen ***/
module.exports = function() { 
    this.blokken = function() { 
      return getBlokken();
    };
    this.afbeeldingen = imageArray;
    this.blokNamen = function(){
      return getBlokNamen();
    };
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

/*** Locaties mappen met data ***/
const postsFolder = './public/data/blokken/';
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
app.set('views', path.join(__dirname, 'views'));
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

app.get('/blokken/:name', function(req, res, next){
  var yml = yaml.load(fs.readFileSync('./public/data/blokken/' + req.params.name.replace(/\s/g,'') + '.yml', {encoding: 'utf-8'}));
  
  var json = '{"kolommen": []}'
  if (yml.bloktype != "contact" && yml.bloktype != "kolom") {
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
      nieuw: "false"
    }); 

  
    
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
      } else if(alleBlokken[i].bloktype === "contact") {
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
        wstream.write('id: ' + `${alleBlokken[i].id - 1}` + '\n');
        wstream.write('bloktype: contact');
        wstream.end();
      } else if (alleBlokken[i].bloktype == "kolom") {
        var wstream = fs.createWriteStream(postsFolder + alleBlokken[i].name.replace(/\s/g,'') + '.yml');
  wstream.write('name: ' + alleBlokken[i].name + '\n');
  wstream.write('blokTitel: ' + alleBlokken[i].blokTitel + '\n');
  wstream.write('bloktype: kolom' + '\n');
  wstream.write('id: ' + `${alleBlokken[i].id - 1}` + '\n');
  wstream.write('kolomen:' + '\n');
  for (k = 0; k < alleBlokken[i].kolomen.length; k++) {
    wstream.write('  - titel: ' + alleBlokken[i].kolomen[k].titel + '\n'+ '    beschrijving: ' + alleBlokken[i].kolomen[k].beschrijving + '\n' + '    afbeelding: ' + alleBlokken[i].kolomen[k].afbeelding + '\n' );
  }
  wstream.end();
      }
      
      alleBlokken[i].id = alleBlokken[i].id - 1;
    
  } 
  }


  res.redirect('/blokken');
})






app.post("/instellingenOpslaan", function (req, res, next) {
 
  fs.writeFileSync("config.yml",
`sitename: ${req.body.title}
auteur: ${req.body.auteur}
headerImage: ${req.body.headerImage}
slogan: ${req.body.slogan}
logo: ${req.body.logo}`
        );
  var configYaml = yaml.load(fs.readFileSync('config.yml', {encoding: 'utf-8'}));
    res.redirect('/instellingen');
});


/*** AANMAKEN VAN BLOKKEN ***/
// Aanmaken Tekst Blok
app.post("/makeTekst", function (req, res, next) { 
  // Ophalen blokken voor lengte (id)
  var alleBlokken = getBlokken();

  // Controle of chechbox is gechecked of niet
  var checked;
  if (req.body.checkbox == "on") {
    checked = "true";
  } else {
    checked = "false";
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
  if (req.body.nieuw === "true") {
    wstream.write('id: ' + alleBlokken.length + '\n');
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
  
  // Controle of chechbox is gechecked of niet
  var checked;
  if (req.body.checkbox == "on") {
    checked = "true";
  } else {
    checked = "false";
  }
 
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
  if (req.body.nieuw === "true") {
    wstream.write('id: ' + alleBlokken.length + '\n');
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

  // Aanmaken YAML file
  var wstream = fs.createWriteStream(postsFolder + req.body.naam.replace(/\s/g,'') + '.yml');
  wstream.write('name: ' + req.body.naam + '\n');
  wstream.write('titel: ' + req.body.titel + '\n');
  wstream.write('gsmNr: ' + req.body.gsmNr + '\n');
  wstream.write('telNr: ' + req.body.telNr + '\n');
  wstream.write('adres: ' + req.body.adres + '\n');
  wstream.write('emailAdres: ' + `'${req.body.emailAdres}'` + '\n');
  if (req.body.nieuw === "true") {
    wstream.write('id: ' + alleBlokken.length + '\n');
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

// Aanmaken van kolom blok
app.post("/makeKolom", function (req, res, next) {
  // Ophalen blokken voor lengte (id)
  var alleBlokken = getBlokken();

  // Locatie voor alle diensten files (html)
  var dir = './public/data/blokken/HTML/' + req.body.naam.replace(/\s/g,'') ;

  // Controleren of map al dan niet bestaat
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  // Aanmaken YAML file
  var wstream = fs.createWriteStream(postsFolder + req.body.naam.replace(/\s/g,'') + '.yml');
  wstream.write('name: ' + req.body.naam + '\n');
  wstream.write('blokTitel: ' + req.body.titelBlok + '\n');
  wstream.write('bloktype: kolom' + '\n');
  if (req.body.nieuw === "true") {
    wstream.write('id: ' + alleBlokken.length + '\n');
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
  var obj = yaml.load(fs.readFileSync("./public/data/mail/" + 'mail' + name + ".yml", {encoding: 'utf-8'}));
  exports.mailArray.push(obj);
  res.redirect('/');
});
// Detailpagina emial 
app.get('/mail/:name', function(req, res, next){
  var yml = yaml.load(fs.readFileSync('./public/data/mail/' + req.params.name.replace(" ", "") + '.yml', {encoding: 'utf-8'}));
  var content = fs.readFileSync("./public/data/mail/HTML/" + req.params.name.replace(" ", "") + ".html","utf-8");;
    res.render('detailmail', {
      mail: yml,
      html: content,
      type: req.query.type
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
