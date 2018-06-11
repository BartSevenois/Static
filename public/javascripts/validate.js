function isEmpty(test) {
  if (test == "") {
    return true;
  } else {
    return false;
  }
}

function containsName(test) {

  var arraycontainstitle = (blokkenArray.indexOf(test) > -1);
  if (arraycontainstitle) {
    return true;
  }
  else{
    return false;
  }
}

