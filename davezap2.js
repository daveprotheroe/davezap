
let leftkeydown = false;
let rightkeydown = false;
let spacekeydown = false;
let framecount = 0;
let bugSpeed = 120;

// This is the function canon.
const canvas = document.getElementById ("canvas1"); 

let canon = { 
     x : 0.5 * canvas.width,
     width : 0.05 * canvas.width,
     height : 0.025 * canvas.height,
     y : 0.9 * canvas.height
}; 

let bug = { 
    x : 0.5 * canvas.width,
    width : 0.05 * canvas.width,
    height : 0.05 * canvas.height,
    y : 0.1 * canvas.height,
    alive : true
}; 

var ctx = canvas.getContext("2d");
document.addEventListener("keydown", keydownhandler);

// a handler to rember the state of the cursor keys
function keydownhandler (event) {
    if (event.keyCode == 37) {
        leftkeydown = true;
    }
    if (event.keyCode == 39) {
        rightkeydown = true;

    } 
    if (event.keyCode == 32) {
        spacekeydown = true;
    } 
}

document.addEventListener("keyup", keyuphandler);

// a handler to rember the state of the cursor keys
function keyuphandler (event) {
    if (event.keyCode == 37) {
        leftkeydown = false;
    }
    if (event.keyCode == 39) {
        rightkeydown = false;
    } 
    if (event.keyCode == 32) {
        spacekeydown = false;
    } 
}

function cleanScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawCanon() {
    ctx.fillRect (canon.x - (canon.width * 0.5), canon.y, canon.width, canon.height);
    ctx.fillRect (canon.x - (canon.width * 0.5 * 0.25), canon.y - canon.height, canon.width * 0.25, canon.height);
}

function drawLaser() {
 
        ctx.beginPath();
        ctx.moveTo(canon.x, 0);
        ctx.lineTo(canon.x,canon.y);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3;
        ctx.stroke();   
}
//My attempt to do bug drop upon death and respawn
function isBugHit() {    
    if ((spacekeydown ==true) && ((canon.x >= bug.x) && (canon.x <= (bug.x + bug.width)))){
        return true;
    }  else {
        return false
    }

}

function drawBug() {
    if ((framecount % bugSpeed) == 0){
        bug.x = Math.random() * (canvas.width - bug.width);
    }
    ctx.fillRect (bug.x, bug.y, bug.width, bug.height);
}

function gameLoop(timestamp) {
    framecount +=1;
    if(leftkeydown == true && canon.x >(canon.width * 0.5)) {
        canon.x -=8;
    }
    if(rightkeydown == true && canon.x < (canvas.width - canon.width * 0.5)) {
        canon.x += 8;
    }



    cleanScreen();

    if (bug.alive) {
        drawBug();
    }
    drawCanon();
    if (spacekeydown == true && (framecount % 3) == 0){
        drawLaser(); 
        if (isBugHit()) {
            bug.alive = false;
            console.log("zapped");
        }   else {
            bug.y +=(0.1 * canvas.height);
        } 
    }

      
    window.requestAnimationFrame(gameLoop); 
}

window.requestAnimationFrame(gameLoop);