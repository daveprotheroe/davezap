
let leftkeydown = false;
let rightkeydown = false;
let spacekeydown = false;
let framecount = 0;
let bugDelay = 120;
let score = 0;
let gameState = 0;
let spacewaslifted = false;

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

function init(){
    leftkeydown = false;
    rightkeydown = false;
    spacekeydown = false;
    framecount = 0;
    bugDelay = 120;
    score = 0;
    spacewaslifted = false;

        canon = { 
            x : 0.5 * canvas.width,
            width : 0.05 * canvas.width,
            height : 0.025 * canvas.height,
            y : 0.9 * canvas.height
    }; 

    bug = { 
        x : 0.5 * canvas.width,
        width : 0.05 * canvas.width,
        height : 0.05 * canvas.height,
        y : 0.1 * canvas.height,
        alive : true
        }; 

    }

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

function drawScore() {
    ctx.fillText (score * 10,0,10);
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
    if ((framecount % bugDelay) == 0){
        bug.x = Math.random() * (canvas.width - bug.width);
    }
    ctx.fillRect (bug.x, bug.y, bug.width, bug.height);
}

function welcome() {
    if (spacekeydown == true) {
        gameState = 1;
        init();
    }

}

function playing() {
    framecount +=1;
    if(leftkeydown == true && canon.x >(canon.width * 0.5)) {
        canon.x -=8;
    }
    //console.log(timestamp);
    if(rightkeydown == true && canon.x < (canvas.width - canon.width * 0.5)) {
        canon.x += 8;
    }
    if (bug.y >= canon.y) {
        gameState = 2;
    }
    cleanScreen();

    if (bug.alive) {
        drawBug();
    }
    drawCanon();
    if (spacekeydown == true && (framecount % 3) == 0){
        drawLaser(); 
        if (isBugHit()) {
            score = (score + ((bug.y / canvas.height) * 100));
            bug.y = 0.1 * canvas.height;
            bug.x = Math.random() * (canvas.width - bug.width);
            console.log("zapped");
            bugDelay = (bugDelay- 5);
        }   else {
            bug.y +=(0.03 * canvas.height);
        } 
    }

    drawScore();

}

function dead() {
    cleanScreen();
    if (spacekeydown == false) {
        spacewaslifted = true
    }
    if (spacekeydown == true && spacewaslifted==true) {
        gameState = 1;
        init();
        spacewaslifted = false;
    }
}

function gameLoop(timestamp) {
    if (gameState == 0) {
        welcome();
    }
    if (gameState == 1) {
        playing();
    }
    if (gameState == 2) {
        dead();
    }
    window.requestAnimationFrame(gameLoop); 
}

window.requestAnimationFrame(gameLoop);