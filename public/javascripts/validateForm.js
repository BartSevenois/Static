function validateContact() {
  var name = document.forms["contactForm"]["name"].value;
  var gsmNr = document.forms["contactForm"]["gsmNr"].value;
  var adres = document.forms["contactForm"]["adres"].value;
  var emailAdres = document.forms["contactForm"]["emailAdres"].value;

  if(containsName(name)|| isEmpty(name)) {
    if (containsName(name)) {
      document.getElementById("errNaam").textContent="Naam blok bestaat al";
    } else if (isEmpty(name)) {
      document.getElementById("errNaam").textContent="Dit veld is verplicht";
    }   
  } else {
    document.getElementById("errNaam").textContent="";
  }
  
  if (isEmpty(gsmNr)) {
    document.getElementById("errGsm").textContent="Dit veld is verplicht";
  } else {
    document.getElementById("errGsm").textContent="";
  }

  if (isEmpty(adres)) {
    document.getElementById("errAdres").textContent="Dit veld is verplicht";
  } else {
    document.getElementById("errAdres").textContent="";
  }

  if (isEmpty(emailAdres)) {
    document.getElementById("errEmailAdres").textContent="Dit veld is verplicht";
  } else {
    document.getElementById("errEmailAdres").textContent="";
  }

  if(isEmpty(name) || containsName(name) || isEmpty(gsmNr) || isEmpty(adres) || isEmpty(emailAdres)) {
    if (containsName(name)){
      if (nieuw === "true") {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
}

function validateAfbeeldingEnTekst() {
  var name = document.forms["afbeeldingEnTekstForm"]["name"].value;
  var ImgName = document.forms["afbeeldingEnTekstForm"]["afbeelding1"].value;
  if (isEmpty(name) || containsName(name)) {
    if (isEmpty(name)){
      document.getElementById("errNaam").textContent="Dit veld is verplicht";
    } else if(nieuw === "true") {
      if(containsName(name)){
        document.getElementById("errNaam").textContent="Naam blok bestaat al";
      }
      
    }
  } else {
    document.getElementById("errNaam").textContent="";
  }

  if (isEmpty(ImgName)) {
    document.getElementById("errAfbeelding").textContent="Voeg een afbeelding toe";
  } else {
    document.getElementById("errAfbeelding").textContent="";
  }

  if (isEmpty(name) || containsName(name) || isEmpty(ImgName)) {
    if (containsName(name)) {
      if (nieuw === "true") {
        return false;
      } else {
        return true;
      }
    }
    return false;
  } 
}

function validateTekst() {
  var name = document.forms["tekstForm"]["name"].value;
  if (isEmpty(name) || containsName(name)) {
    if (isEmpty(name)){
      document.getElementById("errNaam").textContent="Dit veld is verplicht";
    } else if(containsName(name)) {
      document.getElementById("errNaam").textContent="Naam blok bestaat al";
    }
  } else {
    document.getElementById("errNaam").textContent="";
  }
  if (isEmpty(name) || containsName(name)) {
    if (containsName(name)){
      if (nieuw === "true") {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
    
 
  } 
}