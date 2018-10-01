const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

let leftkeydown = false;
let rightkeydown = false;


let curState = 0;

var x = 200;

const canvas = document.getElementById ("canvas1");

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
}


function mainMenu() {
    // Logic here for drawing the mainmenu and testing for space bar
}

function step(timestamp) {
    if(leftkeydown == true && x >0) {
        x = x-8;
    }
    if(rightkeydown == true && x < canvas.width) {
        x =x+8;
    }
//
    window.requestAnimationFrame(step); 
    let y = canvas.height - (0.05 * canvas.height)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath ();
    ctx.moveTo(x, (canvas.height - (0.1 * canvas.height)));
          ctx.lineTo(x, y);
    ctx.stroke();
}


window.requestAnimationFrame(step);

