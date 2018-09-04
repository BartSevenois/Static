
test();

function test () {

if (checked == "true") {

  document.getElementById("checkbox").checked = true;
  document.getElementById('afbeeldingVeld').style.display = 'block';
    document.getElementById('kleur').style.display = 'none';
}

 }




 document.getElementById('checkbox').onchange = function() {
  if (this.checked) {
      // Titel kleur
      $(".titelKleur").spectrum({
        color: "#ffffff",
        showInput: true,
        change: function(color) {
          $("#hexTitelKleur").val(color.toHexString());
          $("#hexTitelKleurLog").text(color.toHexString());
        }
      });
      console.log(bloktype);
      if (bloktype === "tekst" || bloktype === "afbeeldingEnTekst" || bloktype === "video"){
        $(".tekstKleur").spectrum({
        color: "#ffffff",
        showInput: true,
        change: function(color) {
        $("#hexTekstKleur").val(color.toHexString());
        $("#hexTekstKleurLog").text(color.toHexString());
        }
        });
      }
      if (bloktype === "tekst" || bloktype === "afbeeldingEnTekst" || bloktype === "video"){
        document.getElementById("hexTekstKleur").value = "#ffffff";
        $("#hexTekstKleurLog").text("#ffffff");
      } else if(bloktype === "contact"){
        document.getElementById("hexTekstKleur").value = "#323232";
        $("#hexTekstKleurLog").text("#323232");
      }
      
      document.getElementById("hexTitelKleur").value = "#ffffff";
      $("#hexTitelKleurLog").text("#ffffff");
    
  } else {
    
    if (bloktype === "tekst" || bloktype === "afbeeldingEnTekst" || bloktype === "video"){
        $(".tekstKleur").spectrum({
        color: "#323232",
        showInput: true,
        change: function(color) {
        $("#hexTekstKleur").val(color.toHexString());
        $("#hexTekstKleurLog").text(color.toHexString());
        }
        });
    }
      $(".titelKleur").spectrum({
        color: "#323232",
        showInput: true,
        change: function(color) {
          $("#hexTitelKleur").val(color.toHexString());
          $("#hexTitelKleurLog").text(color.toHexString());
        }
      });
     if (bloktype !== "kolom"){
      document.getElementById("hexTekstKleur").value = "#323232";
        $("#hexTekstKleurLog").text("#323232");
     }
      
      document.getElementById("hexTitelKleur").value = "#323232";
      $("#hexTitelKleurLog").text("#  323232");
    
  }
    document.getElementById('afbeeldingVeld').style.display = this.checked ? 'block' : 'none';
    document.getElementById('kleur').style.display = this.checked ? 'none' : 'block';
  
};