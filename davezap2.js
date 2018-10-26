// All global variables
let leftkeydown = false;
let rightkeydown = false;
let spacekeydown = false;
let framecount = 0;
let bugDelay = 120;
let bombDelay = 120;
let soundDelay = 150;
let score = 0;
let highScore = localStorage.getItem("highScore");;
let gameState = 0;
let spacewaslifted = false;
let lives = 3;
const canvas = document.getElementById ("canvas1"); 
let ctx = canvas.getContext("2d");
let windowYPos = 0;
let aspectRatio = canvas.width / canvas.height;

// The canon object with all it's parameters
let canon = { 
     x : 0.5 * canvas.width,
     width : 0.025 * canvas.width,
     height : 0.0125 * canvas.height,
     y : 0.9 * canvas.height,
     laserFrequency : 100,
     CanonFrequency : 200
}; 
// The bug object with all it's parameters
let bug = { 
    x : 0.5 * canvas.width,
    width : 0.02 * canvas.width,
    height : 0.02 * canvas.height * aspectRatio,
    y : 0.1 * canvas.height,
    frequency : 120
}; 

let bomb = {
    x : bug.x,
    y : bug.y,
    width : 0.02 * canvas.width,
    height : 0.02 * canvas.height * aspectRatio,
    spawned : false,
    bombFrequency : 80
}

// Initalisation paramenters to load in each gamestate set as a function to call later.
function initRound(){
    leftkeydown = false;
    rightkeydown = false;
    spacekeydown = false;
    framecount = 0;
    bugDelay = 120;
    spacewaslifted = false;


// Remove the LET part here as it would reassign the variable instead of using the parameters if you did.
    canon = { 
        x : 0.5 * canvas.width,
        width : 0.025 * canvas.width,
        height : 0.0125 * canvas.height,
        y : 0.9 * canvas.height,
        laserFrequency : 100,
        CanonFrequency : 200
    }; 
// Remove the LET part here as it would reassign the variable instead of using the parameters if you did.
    bug = { 
        x : bug.x,
        width : 0.02 * canvas.width,
        height : 0.02 * canvas.height * aspectRatio,
        y : 0.1 * canvas.height,
        alive : true,
        frequency : 120
    }; 
// Remove the LET part here as it would reassign the variable instead of using the parameters if you did. 
    bomb = {
        x : bug.x,
        y : bug.y,
        width : 0.02 * canvas.width,
        height : 0.02 * canvas.height * aspectRatio,
        spawned : false,
        bombFrequency : 500
    }; 
};

function drawStars(speed, size){
    windowYPos += speed;
    let nearestBlock = windowYPos / canvas.height;
    let blockIndex = Math.floor(nearestBlock);
    let blockOffset = -(windowYPos % canvas.height);
    drawStarBlock(blockIndex, blockOffset, size);
    drawStarBlock((blockIndex + 1), (blockOffset + canvas.height), size);
            return windowYPos;
}

function drawStarBlock(blockIndex, blockOffset, size) {
    srand(blockIndex);
    let numStars = 16;
    for(let i = 0; i < numStars; i++) {
        let numCanvasPixels = (canvas.width * canvas.height);
        let randomValue = rand();
        let chosenPixel = randomValue % numCanvasPixels;
        let y = Math.floor(chosenPixel / canvas.width);
        let x = chosenPixel % canvas.width;
        y = y + blockOffset;
        ctx.fillStyle = 'white';
        ctx.fillRect(x, canvas.height - y, size, size);
    }
}

let seed = 0;
function srand(s) {
            seed = s;
}

function rand() {
    seed = (seed * 16807) % 2147483647;
    return seed;
}

function bugSound(){
    let context = new (window.AudioContext || window.webkitAudioContext)();
    let oscillator = context.createOscillator();
    let now = context.currentTime;
    oscillator.type = 'sawtooth';
    oscillator.frequency.value = bug.frequency;
    oscillator.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.1);
    //oscillator.disconnect(context.destination);
}

function laserSound (){
    let context = new (window.AudioContext || window.webkitAudioContext)();
    let oscillator = context.createOscillator();
    let now = context.currentTime;
    oscillator.type = 'sawtooth';
    oscillator.frequency.value = canon.laserFrequency;
    oscillator.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.1);
}

function bombSound(){
    // NEED TO CREATE AN EXPONENTIAL RAMP IN PITCH
    let context = new (window.AudioContext || window.webkitAudioContext)();
    let oscillator = context.createOscillator();
    let now = context.currentTime;
    oscillator.type = 'sine';
    oscillator.frequency.value = bomb.frequency;
    oscillator.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.1);
}

function destructionSound(){
    let context = new (window.AudioContext || window.webkitAudioContext)();
    let oscillator = context.createOscillator();
    let now = context.currentTime;
    oscillator.type = 'sawtooth';
    oscillator.frequency.value = 200;
    oscillator.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.02);
}

function initGame(){
    lives = 3;
    score = 0;
    initRound();
}
// a handler to rember the state of the cursor keys
document.addEventListener("keydown", keydownhandler);
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
// This function is to clear the screen after each stroke of a drawing has been done, otherwise each refresh would leave trails.
function cleanScreen() {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


// This fucntion loads all the text into the welcome screen.
function welcomeText() {
    ctx.strokeStyle = 'black';
    ctx.font = '20pt calibri';
    ctx.textAlign = 'center';
    ctx.fillText("Welcome to Davezap!",canvas.width * 0.5, canvas.height * 0.2);
    ctx.font = '12pt calibri';
    ctx.fillText("The object of the game is to use your",canvas.width * 0.5, canvas.height * 0.3);
    ctx.fillText("laser gun to zap the decending bug",canvas.width * 0.5, canvas.height * 0.35);
    ctx.fillText("before it lands or bombs you.",canvas.width * 0.5, canvas.height * 0.40);
    ctx.fillText("Your score increases every time you",canvas.width * 0.5, canvas.height * 0.45);
    ctx.fillText("zap the bug, with more points being",canvas.width * 0.5, canvas.height * 0.5);
    ctx.fillText("given the lower the bug is; it will be",canvas.width * 0.5, canvas.height * 0.55);
    ctx.fillText("displayed when you are killed.",canvas.width * 0.5, canvas.height * 0.6);
    ctx.fillText("Press SPACE to start the game",canvas.width * 0.5, canvas.height * 0.8);
}
// This function loads all the text into the Dead screen.
function deadText() {
    ctx.font = '20pt calibri';
    ctx.textAlign = 'center';
    ctx.fillText("YOU ARE DEAD!",canvas.width * 0.5, canvas.height * 0.2);
    ctx.font = '12pt calibri';
    ctx.fillText("Your score is",canvas.width * 0.5, canvas.height * 0.35);
    ctx.fillText("The high score is",canvas.width * 0.5, canvas.height * 0.5);
    ctx.fillText("Press SPACE to start the game",canvas.width * 0.5, canvas.height * 0.8);
}

// This function draws the score in the top left corner.
function drawScore() {
    if (gameState == 1){
    ctx.font = '20pt calibri';
    ctx.textAlign = 'left';
    ctx.strokeStyle = 'black';
    ctx.fillText("Score",canvas.width * 0.01, canvas.height * 0.05);
    ctx.fillText ((score * 10).toFixed(0),canvas.width * 0.07,canvas.height * 0.05);
    }
     else {
        ctx.font = '20pt calibri';
        ctx.textAlign = 'centre';
        ctx.fillText ((score * 10).toFixed(0),canvas.width * 0.5,canvas.height * 0.4);
        ctx.fillText ((highScore * 10).toFixed(0),canvas.width * 0.5,canvas.height * 0.6);
    }
}

function drawLives() {
    ctx.fillText("Lives",canvas.width * 0.01, canvas.height * 0.08);
    ctx.fillText ((lives),canvas.width * 0.07,canvas.height * 0.08);
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
        return false;
    }
}

function bugDrop(){
    bug.y +=(0.03 * canvas.height);
    bug.frequency = bug.frequency + 20;
}

function drawBug() {
    if ((framecount % bugDelay) == 0){
        bug.x = Math.random() * (canvas.width - bug.width);
        bugSound();
        if (Math.random() <0.7 && bomb.spawned == false)  {
            bomb.spawned = true;
            bomb.frequency = bomb.frequency -50;
            bomb.x = bug.x;
            bomb.y = bug.y + bug.height;
        }
        
    }
    let h = bug.height / 8;
    let w = bug.width / 8;
    let y = 0;
    ctx.fillStyle = 'white';
    ctx.fillRect (bug.x + (3 * w), bug.y, w * 2, h);  
    y += h;

    ctx.fillRect (bug.x + (2 * w), bug.y + y, w * 4, h);
    y += h;
    ctx.fillRect (bug.x + w, bug.y + y, (w * 6), h);
    y += h;
    ctx.fillRect (bug.x, bug.y + y, w * 2, h);
    ctx.fillRect (bug.x + (3 * w), bug.y + y, (w * 2), h);
    ctx.fillRect (bug.x + (6 * w), bug.y + y, (w * 2), h);
    y += h;
    ctx.fillRect (bug.x + w, bug.y + y, (w * 6), h);
    y += h;
    ctx.fillRect (bug.x + (2 * w), bug.y + y, w * 4, h);
    y += h;
    ctx.fillRect (bug.x + (2 * w), bug.y + y, w, h);
    ctx.fillRect (bug.x + (5 * w), bug.y + y, w, h);
    y += h;
    ctx.fillRect (bug.x + w, bug.y + y, w, h);
    ctx.fillRect (bug.x + (6 * w), bug.y + y, w, h);

}
// the math.random inside here needs to be a delay on when to drop the bomb not it's position. Does it only drop 1 bomb between succsefful hits? 
function drawBomb(){
    if (bomb.spawned) {
        bomb.y = bomb.y + 8;
        bomb.frequency = bomb.frequency -50;
        if (bomb.y > canvas.height){
            bomb.spawned = false;
        }
            if (bomb.x > (canon.x - (canon.width * 0.5)) && (bomb.x < (canon.x + (canon.width * 0.5)))){
                if (bomb.y > (canon.y - (canon.height * 0.5)) && (bomb.y < (canon.y + (canon.height * 0.5)))) {
                     killCanon();
                }

             }
        //ctx.fillRect (bomb.x, bomb.y, bug.width, bug.height);     
    let h = bomb.height / 8;
    let w = bomb.width / 8;
    let y = 0;
    ctx.fillStyle = 'white';
    ctx.fillRect (bomb.x + (2 * w), bomb.y + y, w, h);  
    ctx.fillRect (bomb.x + (5 * w), bomb.y + y, w, h);  
    y += h;
    ctx.fillRect (bomb.x + (2 * w), bomb.y + y, w, h);  
    ctx.fillRect (bomb.x + (5 * w), bomb.y + y, w, h);  
    y += h;
    ctx.fillRect (bomb.x + (3 * w), bomb.y + y, (w * 2), h);
    y += h;
    ctx.fillRect (bomb.x + (3 * w), bomb.y + y, w * 2, h);
    y += h;
    ctx.fillRect (bomb.x + (2 * w), bomb.y + y, w * 4, h);
    y += h;
    ctx.fillRect (bomb.x + (2 * w), bomb.y + y, w * 4, h);
    y += h;
    ctx.fillRect (bomb.x + (2 * w), bomb.y + y, w * 4, h);
    y += h;
    ctx.fillRect (bomb.x + (3 * w), bomb.y + y, w * 2, h);
    }
}

function welcome() {
    if (spacekeydown == true) {
        gameState = 1;
        initGame();
    }
    welcomeText();
}

function killCanon() {
    lives = lives - 1;
    if (lives == 0){
        gameState = 2;
    }
    else {
        initRound();
        }
}

function playing() {
    //The black background of the canvas isn't working
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    framecount +=1;
    if(leftkeydown == true && canon.x >(canon.width * 0.5)) {
        canon.x -=8;
    }
    //console.log(timestamp);
    if(rightkeydown == true && canon.x < (canvas.width - canon.width * 0.5)) {
        canon.x += 8;
    }
    if (bug.y >= canon.y) {
        killCanon();
    }
    cleanScreen();

    if (bug.alive) {
        drawBug();
    }
    drawCanon();
    if (spacekeydown == true && (framecount % 3) == 0){
        drawLaser(); 
        laserSound();
        if (isBugHit()) {
            score = (score + ((bug.y / canvas.height) * 100));
            bug.y = 0.1 * canvas.height;
            bug.x = Math.random() * (canvas.width - bug.width);
            console.log("zapped");
            bugDelay = (bugDelay- 5);
        }   else {
            bugDrop();
            
        } 
    }
    drawStars(5, 3);
 
    drawBomb();
    drawScore();
    drawLives();
}

function dead() {
   // cleanScreen();
    if (spacekeydown == false) {
        spacewaslifted = true
    }
    if (spacekeydown == true && spacewaslifted==true) {
        gameState = 1;
        initGame();

        spacewaslifted = false;
    }

    deadText();
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
        cleanScreen();    }
    drawScore();

}

function gameLoop(timestamp) {
    //main UI state machine
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
