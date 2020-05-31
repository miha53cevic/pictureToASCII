let fontSize;
let Grouping;

function options() {
    fontSize = document.getElementById('fontsize').value;
    Grouping = document.getElementById('grouping').value;

    document.getElementById('asciiArea').style.fontSize = fontSize + "px";
}