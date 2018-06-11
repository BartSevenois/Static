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
 bi = bi.replace("http://localhost:3000/images/", "");

 document.getElementById(id).value = bi;


modal.style.display = "none";
     //var filename = fullPath.replace(/^.*[\\\/]/, '');
     // or, try this, 
     // var filename = fullPath.split("/").pop();

    //document.getElementById("result").value = filename;
}

function close() {
    modal.style.display = "none";
    alert("kak");
}