/** TODO's
 * 
 * 
 * 1. Slider für Astlängen-Abnahme in %
 * 1. Astlänge soll jedesmal in einem gewissen Rahmen random sein
 *      1.1 Slider für Astlänge in %
 * 2. Farbe
 *      2.1 Farbe soll zunehmen, z.B. von Schwarz nach Grün
 * 3. Nur die letzten Blätter viel Dicker oder in einer anderen geometrischen Form
 * 4. 2x Bäume gleichzeitig
 *      4.1 So viel Bäume wie gut aufs Canvas passen (bei 3x Monitor dann mehr)
 * 5. Bäume sollen dort gezeichnet werden, wo man hinklickt, aber animiert und nicht plötzlich.
 * 
 * Einige Ideen von: https://linz.coderdojo.net/uebungsanleitungen/programmieren/web/svg-fraktalbaum/
 * 
 * BUG's
 * 1. linienCounter vergisst die Blätter (könnte man einfach draufrechnen)
 * 2. Wenn der Slider bewegt wird, triggert der Mausklick event Handler
 * 2. Winkel mitteln sich nicht zur Gabelung
 * 
 * 
 * Vorlesung zu Fraktalen: https://docplayer.org/52048053-Fraktale-geometrie-chaos-und-ordnung.html 
 * 
 */



//#region Globals

// Canvas
const canvas = document.getElementsByTagName("Canvas")[0];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
console.log("Initiale Canvas Größe: " + canvas.width + "/" + canvas.height);
const ctx = canvas.getContext("2d");


// p Tags / Label
const labelBranchAngle = document.getElementById("labelBranchAngle");
const labelRekursionsTiefe = document.getElementById("labelRekursionsTiefe");
const labelTotalLines = document.getElementById("labelTotalLines");
const labelBranchWidthPercent = document.getElementById("labelBranchWidthPercent");
const labelBranchLengthDecrease = document.getElementById("labelBranchLengthDecrease");

// Slider
const sliderBranchWidth = document.getElementById("sliderBranchWidth");
const sliderBranchLengthDecrease = document.getElementById("sliderBranchLengthDecrease");


// Fraktalattributes
var branchLenInPx = 10;
var branches = 2;
var branchAngle = 10;
var bodyColor = "gray";
var leaveColor = "red";
var branchWidthIncrease = 1.0;
var branchLengthDecrease = 0.7; // resultiert in 30%
var treeHightDivident = 4;
var totalLines = 0;

//#endregion Globals




//#region Functions

function drawTree(startX, startY, len, angle, branchWidth){
    
    //starX and Y: Punkt von dem aus der Baum wächst
    //len: Länge der aktuellen Linie
    //angle: Winkel
    //branchWidth: für die Breite der Linien

    ctx.beginPath();
    ctx.save(); // Starte den "Canvas Stack" und speichert das gezeichnete Bild auf dem Stack
    ctx.strokeStyle = bodyColor;
    ctx.fillStyle = leaveColor;
    ctx.lineWidth = branchWidth;

    //bewegt das gesamte Canvas
    ctx.translate(startX, startY); 

    // Rotations Matrix?
    ctx.rotate(angle * Math.PI/180); // PI/180 um radians in degrees umzurechnen

    // Linie von Unten nach Oben
    ctx.moveTo(0,0);
    ctx.lineTo(0, -len);
    ctx.stroke();


    // damit die Rekursion ein Limit hat
    if (len < branchLenInPx) {
        ctx.restore(); //dropped alle (eine) Veränderungen seit dem letzten ctx.save() auf dem Canvas Stack
        return;
    }
    else{
        totalLines++;
    }

    // Rekursion:
    // StartPunkt ist immer noch 0, aber die Länge der Linie wird in jeder Iteration um 30% kleiner
    // Der Winkel wird in jeder iteration um 5 grad stärker, die Ast-Breite bleibt die gleiche
    drawTree(0, -len, len * branchLengthDecrease, angle + branchAngle, branchWidth * branchWidthIncrease);
    // es sollen zwei Äste entstehen, der 2. in die entgegengesetzte Richtung
    drawTree(0, -len, len * branchLengthDecrease, angle - branchAngle, branchWidth * branchWidthIncrease);

    // "nach jeder Iteration, zurück" wohin???
    ctx.restore();
}

//#endregion Functions






//#region Main

drawTree(canvas.width/2, canvas.height, canvas.height / 4, 0, 1);
labelBranchAngle.innerHTML = "BranchAngle: " +branchAngle;
labelRekursionsTiefe.innerHTML = "BranchLenInPx: " +branchLenInPx;
labelTotalLines.innerHTML = "TotalLines: " +totalLines;

// Todo
// so viele drawTree()'s aufrufen wie auf den Canvas passen

//#endregion Main







//#region EventListener

//slider
sliderBranchWidth.addEventListener("input", ()=>{
    labelBranchWidthPercent.innerHTML = sliderBranchWidth.value +"%" ;

    branchWidthIncrease = 1.0 + (sliderBranchWidth.value / 100);
});

sliderBranchLengthDecrease.addEventListener("input", ()=>{
    labelBranchLengthDecrease.innerHTML = sliderBranchLengthDecrease.value +"%" ;

    branchLengthDecrease = 1 - (sliderBranchLengthDecrease.value / 100);
});




// Window Listener ...

// Mousemove
window.addEventListener('mousemove', (e) => {

    labelTotalLines.innerHTML = "TotalLines: " +totalLines;
    totalLines = 0;

    // Winkel durch Bewegung auf der X-Achse
    if (e.x > (canvas.width / 2)) {
        angle = ( (e.x - (canvas.width / 2) )  /  (canvas.width / 2)) * 40;
    }
    else{
        angle =  ( 1 - (e.x / (canvas.width / 2)) ) * -40;
    }
    
    // Länge der Äste durch Bewegung auf der Y-Achse
    yPercent = 1 - ( e.y / canvas.height );
    len = yPercent * (canvas.height / treeHightDivident);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawTree(canvas.width/2, canvas.height, len, angle, 1);
});

// Rechts- & Links-Klick
window.addEventListener("contextmenu", (e) => {
    
    labelBranchAngle.classList.toggle("glowSchatten");

    branchAngle--;
    labelBranchAngle.innerHTML = "BranchAngle: " +branchAngle;
    e.preventDefault();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTree(canvas.width/2, canvas.height, len, angle, 1);
});
window.addEventListener("click", () => {
    labelBranchAngle.classList.toggle("glowSchatten");

    branchAngle++;
    labelBranchAngle.innerHTML = "BranchAngle: " +branchAngle;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTree(canvas.width/2, canvas.height, len, angle, 1);
});
window.addEventListener("mousedown", () => {
    labelBranchAngle.classList.toggle("glowSchatten");
});

// Funktion bringt nix, weil keine animate() verwendet
window.addEventListener("wheel", (e) => {

    labelRekursionsTiefe.innerHTML = "BranchLenInPx: " + branchLenInPx;
    
    labelTotalLines.innerHTML = "TotalLines: " +totalLines;
    totalLines = 0;

    labelRekursionsTiefe.classList.toggle("glowSchatten");

    //MouseWheel Runter
    if (e.deltaY < 0) {
        branchLenInPx++;
        if(branchLenInPx >= 40){
            branchLenInPx = 40;
        }
    }

    //MouseWheel Hoch
    if (e.deltaY > 0) {
        branchLenInPx--;
        if(branchLenInPx <= 1){
            branchLenInPx = 1;
        }
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTree(canvas.width/2, canvas.height, len, angle, 1);
});

window.addEventListener("resize",() => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log("Resize Größe: " + canvas.width + "/" + canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

//#endregion EventListener