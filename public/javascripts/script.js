function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "navigatie") {
        x.className += " responsive";
        console.log("test");
    } else {
        x.className = "navigatie";
    }
}





