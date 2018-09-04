function validateContact() {
  var name = document.forms["contactForm"]["name"].value;
  var gsmNr = document.forms["contactForm"]["gsmNr"].value;
  var adres = document.forms["contactForm"]["adres"].value;
  var emailAdres = document.forms["contactForm"]["emailAdres"].value;
  var titel = document.forms["contactForm"]["titel"].value;
  var huidigeNaam = document.forms["contactForm"]["huidigeNaam"].value;
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


  if (isEmpty(titel)){
    document.getElementById("errTitel").textContent="Dit veld is verplicht";
  } else {
    document.getElementById("errTitel").textContent=""; 
  }

  if (containsName(name)){
    if (nieuw === "true"){
      return false;
    } else {
      if (huidigeNaam === name) {
        if (isEmpty(name)){
          return false;
        } else if(isEmpty(titel)){
          return false;
        } else if(isEmpty(gsmNR)){
          return false;
        } else if(isEmpty(adres)){
          return false;
        } else if(isEmpty(emailAdres)){
          return false;
        } else {
          return true;
        }
        
      } else {
        return false
      }
    }
  } else if (isEmpty(titel)){
    return false;
  } else if (isEmpty(name)) {
    return false;
  } else if(isEmpty(gsmNR)){
    return false;
  } else if(isEmpty(adres)){
      return false;
  } else if(isEmpty(emailAdres)){
      return false;
  } else {
      return true;
  }
}


function validateTekst() {
  var name = document.forms["tekstForm"]["name"].value;
  if (bloktype === "kolom"){
    var titel = document.forms["tekstForm"]["kak"].value;
  } else {
    var titel = document.forms["tekstForm"]["titel"].value;
  }
  
  console.log(titel);
  var huidigeNaam = document.forms["tekstForm"]["huidigeNaam"].value;
  if (isEmpty(name)){
    document.getElementById("errNaam").textContent="Dit veld is verplicht";
  } 
  else if (containsName(name)){
    if (nieuw === "true"){
      document.getElementById("errNaam").textContent="Naam blok bestaat al";
    } else if (nieuw === "false") {
      if (huidigeNaam === name){
        document.getElementById("errNaam").textContent="";
      } else {
        document.getElementById("errNaam").textContent="Naam blok bestaat al";
      }
      
    } 
  } else {
    document.getElementById("errNaam").textContent="";
  }

  if (isEmpty(titel)){
    document.getElementById("errTitel").textContent="Dit veld is verplicht";
  } else {
    document.getElementById("errTitel").textContent=""; 
  }

  if (containsName(name)){
    if (nieuw === "true"){
      return false;
    } else {
      if (huidigeNaam === name) {
        if (isEmpty(name)){
          return false;
        } else if(isEmpty(titel)){
          return false;
        } else {
          return true;
        }
        
      } else {
        return false
      }
    }
  } else if (isEmpty(titel)){
    return false;
  } else if (isEmpty(name)) {
    return false;
  } else {
    return true;
  }

}

function validateKolom() {
  var name = document.forms["kolomForm"]["name"].value;
  
  if (isEmpty(name)){
    document.getElementById("errNaam").textContent="Dit veld is verplicht";
  } 
  else if (containsName(name)){
    if (nieuw === "true"){
      document.getElementById("errNaam").textContent="Naam blok bestaat al";
    } else if (nieuw === "false") {
      if (huidigeNaam === name){
        document.getElementById("errNaam").textContent="";
      } else {
        document.getElementById("errNaam").textContent="Naam blok bestaat al";
      }
      
    } 
  } else {
    document.getElementById("errNaam").textContent="";
  }
  if (containsName(name)){
    if (nieuw === "true"){
      return false;
    } else {
      if (huidigeNaam === name) {
        if (isEmpty(name)){
          return false;
        } else {
          return true;
        }
        
      } else {
        return false
      }
    }
  }  else if (isEmpty(name)) {
    return false;
  } else {
    return true;
  }
}