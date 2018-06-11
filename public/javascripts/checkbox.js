
test();
function test () {
if (checked == "true") {

  document.getElementById("checkbox").checked = true;
}

  if (document.getElementById('checkbox').checked) {
      // Titel kleur


      document.getElementById("titelColorText").value = "#ffffff";
      $('#titelColor').spectrum({
         color: '#ffffff',
         showAlpha: true,showInput: true,
    });
    

    // Tekstkleur
    document.getElementById("tekstColorText").value = "#ffffff";
    $('#tekstColor').spectrum({
         color: '#ffffff',
         showAlpha: true,showInput: true,
    });
    
  } else {
    $('#titelColor').spectrum({
         color: '#323232',
         showAlpha: true,showInput: true,
    });
    document.getElementById("titelColorText").value = "#323232";
    $('#tekstColor').spectrum({
         color: '#323232',
         showAlpha: true,showInput: true,
    });
    document.getElementById("tekstColorText").value = "#323232";
  }
    document.getElementById('afbeeldingVeld').style.display = document.getElementById('checkbox').checked ? 'block' : 'none';
    document.getElementById('kleur').style.display = document.getElementById('checkbox').checked ? 'none' : 'block';
 }

 document.getElementById('checkbox').onchange = function() {
  if (this.checked) {
      // Titel kleur
      document.getElementById("titelColorText").value = "#ffffff";
      $('#titelColor').spectrum({
         color: '#ffffff',
         showAlpha: true,showInput: true,
    });
    

    // Tekstkleur
    document.getElementById("tekstColorText").value = "#ffffff";
    $('#tekstColor').spectrum({
         color: '#ffffff',
         showAlpha: true,showInput: true,
    });
    
  } else {
    $('#titelColor').spectrum({
         color: '#323232',
         showAlpha: true,showInput: true,
    });
    document.getElementById("titelColorText").value = "#323232";
    $('#tekstColor').spectrum({
         color: '#323232',
         showAlpha: true,showInput: true,
    });
    document.getElementById("tekstColorText").value = "#323232";
  }
    document.getElementById('afbeeldingVeld').style.display = this.checked ? 'block' : 'none';
    document.getElementById('kleur').style.display = this.checked ? 'none' : 'block';
  
};