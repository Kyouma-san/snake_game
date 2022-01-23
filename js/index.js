//game constants
let inputDir = { x: 0, y: 0 };
let speed = 8;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [
    { x: 13, y: 15 }
]

let food = { x: 5, y: 5 }

//game functions

function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snakeArr) {
    //if snake collide with it's own body
    for (let i = 1; i < snakeArr.length; i++) {
        if (snakeArr[i].x === snakeArr[0].x && snakeArr[i].y === snakeArr[0].y) {
            return true;
        }
    }
    //bumping into wall
    if (snakeArr[0].x >= 18 || snakeArr[0].x <= 0 || snakeArr[0].y >= 18 || snakeArr[0].y <= 0) {
        return true;
    }
    return false;
}

function gameEngine() {
    //updating snake array
    if (isCollide(snakeArr)) {
        inputDir = { x: 0, y: 0 }
        alert("Game Over. Press any key to play again!")
        snakeArr = [
            { x: 13, y: 15 }    //resetting snake array
        ]
        score = 0;
        location.reload();

    }


    //after consuming the food --> increase the snake body and regenerate the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y })
        score += 1;

        //Changing the highscore
        if(score>highScoreVal){
            highScoreVal = score;
            localStorage.setItem("snekHighScore", JSON.stringify(highScoreVal))
            highBox.innerHTML = "High Score: " + highScoreVal
        }
        scoreBox.innerHTML = "Score: " + score;
        let a = 1;
        let b = 17;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) }
    }

    //Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] }  /// ... destructuring and creating a new obj 
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;


    //render snake & food
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index === 0) {
            snakeElement.classList.add('head')
        } else {
            snakeElement.classList.add('snake')
        }
        board.appendChild(snakeElement)
    })

    // rendering food element
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food')
    board.appendChild(foodElement)

}







//main logic
let highScore = localStorage.getItem("snekHighScore");

if(highScore === null){
    highScoreVal = 0;
    localStorage.setItem("snekHighScore", JSON.stringify(highScoreVal))
} else {
    highScoreVal = JSON.parse(highScore)
    highBox.innerHTML = "High Score: " + highScore
}


window.requestAnimationFrame(main);

window.addEventListener('keydown', e => {
    inputDir = { x: 0, y: -1 }  // Starting the game
 
    switch (e.key) {
        case "ArrowUp":
            console.log("ArrowUp")
            inputDir.x = 0;
            inputDir.y = -1;
            break;

        case "ArrowDown":
            console.log("ArrowDown")
            inputDir.x = 0;
            inputDir.y = 1;
            break;

        case "ArrowRight":
            console.log("ArrowRight")
            inputDir.x = 1;
            inputDir.y = 0;
            break;

        case "ArrowLeft":
            console.log("ArrowLeft")
            inputDir.x = -1;
            inputDir.y = 0;
            break;

        default:
            break;
    }
});


//Adding support for touch response

function swipedetect(el, callback){
  
    var touchsurface = el,
    swipedir,
    startX,
    startY,
    distX,
    distY,
    threshold = 150, //required min distance traveled to be considered swipe
    restraint = 100, // maximum distance allowed at the same time in perpendicular direction
    allowedTime = 300, // maximum time allowed to travel that distance
    elapsedTime,
    startTime,
    handleswipe = callback || function(swipedir){}
  
    touchsurface.addEventListener('touchstart', function(e){
        var touchobj = e.changedTouches[0]
        swipedir = 'none'
        dist = 0
        startX = touchobj.pageX
        startY = touchobj.pageY
        startTime = new Date().getTime() // record time when finger first makes contact with surface
        e.preventDefault()
    }, false)
  
    touchsurface.addEventListener('touchmove', function(e){
        e.preventDefault() // prevent scrolling when inside DIV
    }, false)
  
    touchsurface.addEventListener('touchend', function(e){
        var touchobj = e.changedTouches[0]
        distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime // get time elapsed
        if (elapsedTime <= allowedTime){ // first condition for awipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
                swipedir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
            }
            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
                swipedir = (distY < 0)? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
            }
        }
        handleswipe(swipedir)
        e.preventDefault()
    }, false)
}


window.addEventListener('load', function(){
    var el = document.getElementById('main')
    

    swipedetect(el, function(swipedir){
        if (swipedir != 'none'){
            inputDir = { x: 0, y: -1 }  // Starting the game

            switch (swipedir) {
                case 'top':
                    console.log("ArrowUp")
                    inputDir.x = 0;
                    inputDir.y = -1;
                    break;
        
                case 'down':
                    console.log("ArrowDown")
                    inputDir.x = 0;
                    inputDir.y = 1;
                    break;
        
                case 'right':
                    console.log("ArrowRight")
                    inputDir.x = 1;
                    inputDir.y = 0;
                    break;
        
                case 'left':
                    console.log("ArrowLeft")
                    inputDir.x = -1;
                    inputDir.y = 0;
                    break;
        
                default:
                    break;
            }
        }
    })
}, false)


