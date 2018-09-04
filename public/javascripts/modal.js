var modal = document.getElementById('myModal');
  
  var element = document.getElementById("kolomForm");
  function getAfbeelding(ok) {
    id = ok; 

    modal.style.display = "block";
  }
function setAfbeelding(ok) {

  var img = document.getElementById(ok),
  style = img.currentStyle || window.getComputedStyle(img, false),
  bi = style.backgroundImage.slice(4, -1).replace(/"/g, "");

  var result = /[^/]*$/.exec(bi)[0];
  bi = bi.replace("http://localhost:3000/images/", "");
  console.log(result);
  console.log(id);

  document.getElementById(id).value = result;
 
     document.getElementById( id + "IMG").src = "../images/" + result;

  
 
  modal.style.display = "none";
     //var filename = fullPath.replace(/^.*[\\\/]/, '');
     // or, try this, 
     // var filename = fullPath.split("/").pop();

    //document.getElementById("result").value = filename;
}

function close() {
    modal.style.display = "none";
    console.log("kak");
}