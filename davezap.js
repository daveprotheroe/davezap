const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

let leftkeydown = false;
let rightkeydown = false;
let spacekeydown = false;
let framecount = 0;


let curState = 0;



const canvas = document.getElementById ("canvas1"); 
let canon = { 
     x : 0.5 * canvas.width,
     width : 0.05 * canvas.width,
     height : 0.025 * canvas.height,
     y : 0.9 * canvas.height
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


function mainMenu() {
    // Logic here for drawing the mainmenu and testing for space bar
}

function step(timestamp) {
    framecount +=1;
    if(leftkeydown == true && canon.x >(canon.width * 0.5)) {
        canon.x -=8;
    }
    if(rightkeydown == true && canon.x < (canvas.width - canon.width * 0.5)) {
        canon.x += 8;
    }

//
    window.requestAnimationFrame(step); 
    
    // turn this into a function of canon.
    let y = canvas.height - (0.05 * canvas.height)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect (canon.x - (canon.width * 0.5), canon.y, canon.width, canon.height);
    ctx.fillRect (canon.x - (canon.width * 0.5 * 0.25), canon. y - canon.height, canon.width * 0.25, canon.height);
    if (spacekeydown == true && (framecount % 3) == 0) {
        ctx.beginPath();
        ctx.moveTo(canon.x, 0);
        ctx.lineTo(canon.x,canon.y);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}


window.requestAnimationFrame(step);

//ctx.moveTo(x, (canvas.height - (0.1 * canvas.height)));