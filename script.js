//#region Globals

// Canvas
const canvas = document.getElementsByTagName("Canvas")[0];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
console.log("Initiale Canvas Größe: " + canvas.width + "/" + canvas.height);
const ctx = canvas.getContext("2d");

// Button
const generateButton = document.getElementById("generiereBaum");

// Fraktalattributes
const maxLevel = 5;
const branches = 2;

//#endregion Globals




//#region Functions

function drawTree(startX, startY, len, angle, branchWidth, bodyColor, leaveColor){
    //starX and Y: Punkt von dem aus der Baum wächst
    //len: länger der ersten Linie
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
    if (len < maxLevel) {
        ctx.restore(); //dropped alle (eine) Veränderungen seit dem letzten ctx.save() auf dem Canvas Stack
        return;
    }

    // Rekursion:
    // StartPunkt ist immer noch 0, aber die Länge der Linie wird in jeder Iteration um 0,25 kleiner
    // Der Winkel wird in jeder iteration um 5 grad stärker, die Ast-Breite bleibt die gleiche
    drawTree(0, -len, len * 0.7, angle + 7, branchWidth);
    // es sollen zwei Äste entstehen, der 2. in die entgegengesetzte Richtung
    drawTree(0, -len, len * 0.7, angle - 7, branchWidth);



    // nach jeder Iteration, zurück wohin???
    ctx.restore();
}

//#endregion Functions



//#region Main

drawTree(canvas.width/2, canvas.height, canvas.height / 4, 0, 1, "gray", "red");



//#endregion Main

window.addEventListener('mousemove', (e) => {


    // Winkel durch Bewegung auf der X-Achse
    if (e.x > (canvas.width / 2)) {
        angle = ( (e.x - (canvas.width / 2) )  /  (canvas.width / 2)) * 40;
    }
    else{
        angle =  ( 1 - (e.x / (canvas.width / 2)) ) * -40;
    }

    
    // Länge der Äste durch Bewegung auf der Y-Achse
    yPercent = 1 - ( e.y / canvas.height )
    len = yPercent * (canvas.height / 4)

    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTree(canvas.width/2, canvas.height, len, angle, 1, "gray", "red");

});


// Funktion bringt nix, weil keine animate() verwendet
window.addEventListener("wheel", (e) => {
    //MouseWheel Runter
    if (e.deltaY > 0) {
        maxLevel--
        if(maxLevel <= 0){
            maxLevel = 0
        }
    }

    //MouseWheel Hoch
    if (e.deltaY < 0) {
        maxLevel++
        if(maxLevel >= 5){
            maxLevel = 5
        }
    }
});


window.addEventListener("resize",() => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log("Resize Größe: " + canvas.width + "/" + canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});