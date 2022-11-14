const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

/*
0000    0 - gol
0001    1 - perete
0010    2 - lada
0100    4 - loc_lada
1000    8 - jucator
*/

const moveLeft = 0;
const moveRight = 1;
const moveUp = 2;
const moveDown = 3;

let currMove = moveUp;

const cycleLoop = [0, 1, 0, 2];
let cycleIndex = 0;
let requestA;

let frameCount = 0;

const size_lab = {
    size: 0,
    dX:0,
}
/*
[0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,],
[0,0,0,0,0,0,0,0,],

*/
const totalMap = [//tablou cu toate hartile
    [//tablou cu harta la nivel
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,4,1,0,0,0,0,0,0],
        [0,0,1,1,1,1,1,4,1,1,1,1,1,0,0],
        [0,1,1,0,0,0,0,0,0,0,0,0,1,1,0],
        [1,1,0,0,1,0,1,0,1,0,1,0,0,1,1],
        [1,0,0,1,1,0,0,0,0,0,1,1,0,0,1],
        [1,0,1,1,0,0,1,0,1,0,0,1,1,0,1],
        [1,0,0,0,0,0,2,8,2,0,0,0,0,0,1],
        [1,1,1,1,0,0,1,1,1,0,0,1,1,1,1],
        [0,0,0,1,1,1,1,0,1,1,1,1,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],
    [  
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
        [1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0],
        [1,0,0,2,0,0,0,0,0,2,0,0,1,0,0,0,0],
        [1,0,2,1,0,1,4,1,0,1,2,0,1,0,0,0,0],
        [1,0,0,0,0,1,4|2,1,0,0,0,0,1,1,1,1,1],
        [1,0,0,1,1,1,4,1,1,1,0,0,1,0,0,0,1],
        [1,0,0,4,4|2,4,8,4,4|2,4,0,0,0,0,0,0,1],
        [1,0,0,1,1,1,4,1,1,1,0,0,1,0,0,0,1],
        [1,0,0,0,0,1,4|2,1,0,0,0,0,1,1,1,1,1],
        [1,0,2,1,0,1,4,1,0,1,2,0,1,0,0,0,0],
        [1,0,0,2,0,0,0,0,0,2,0,0,1,0,0,0,0],
        [1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],
    [
        [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0],
        [0,0,0,0,1,1,0,0,0,1,0,0,0,0,0],
        [0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
        [0,0,1,1,1,0,0,0,0,1,1,1,1,1,1],
        [0,0,1,4,1,4,1,0,1,1,4,0,0,0,1],
        [1,1,1,0,1,1,1,0,0,1,1,0,0,0,1],
        [1,0,0,0,1,0,0,2,0,0,1,1,0,1,1],
        [1,0,0,0,0,0,2,8,2,0,0,0,0,0,1],
        [1,0,0,0,1,0,0,2,0,0,1,0,0,0,1],
        [1,1,1,1,1,1,0,0,0,1,1,1,0,1,1],
        [0,1,0,0,4,1,1,0,1,1,1,1,0,1,0],
        [0,1,0,0,0,0,0,0,0,0,0,0,0,1,0],
        [0,1,1,0,0,1,1,1,1,1,1,1,1,1,0],
        [0,0,1,1,1,1,0,0,0,0,0,0,0,0,0],
    ],
    [
        [0,1,1,1  ,1,1,0],
        [1,1,8,0  ,0,1,1],
        [1,0,0,1  ,0,0,1],
        [1,0,2,2|4,2,0,1],
        [1,0,0,4  ,0,0,1],
        [1,1,0,4  ,0,1,1],
        [0,1,1,1  ,1,1,0],
    ],
    [
        [1,1,1,1,0,0,0,0,0,1,1,1,1],
        [1,0,4,1,1,1,1,1,1,1,4,0,1],
        [1,4,0,0,0,0,0,0,0,0,0,4,1],
        [1,1,0,1,1,0,0,0,1,1,0,1,1],
        [0,1,0,1,0,0,0,0,0,1,0,1,0],
        [0,1,0,0,0,1,2,1,0,0,0,1,0],
        [0,1,0,0,0,2,8,2,0,0,0,1,0],
        [0,1,0,0,0,1,2,1,0,0,0,1,0],
        [0,1,1,1,0,0,0,0,0,1,1,1,0],
        [1,1,4,1,1,0,1,0,1,1,4,1,1],
        [1,0,0,0,2,0,1,0,2,0,0,0,1],
        [1,0,0,1,1,0,1,0,1,1,0,0,1],
        [1,1,0,1,4,0,0,0,4,1,0,1,1],
        [0,1,0,2,0,0,0,0,0,2,0,1,0],
        [0,1,0,1,1,0,1,0,1,1,0,1,0],
        [0,1,0,0,0,0,0,0,0,0,0,1,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,0],
    ],
    [
        [0,1,1,1,1,1,0,0],
        [1,1,4,0,0,1,1,1],
        [1,0,0,1,0,2,8,1],
        [1,0,0,1,0,1,0,1],
        [1,0,2|4,0,0,2,4,1],
        [1,0,0,0,0,1,1,1],
        [1,1,1,1,1,1,0,0],
    ],
    [
        [0,1,1,1,1,1,1,0,],
        [1,1,0,0,0,0,1,1,],
        [1,4,4,0,0,0,0,1,],
        [1,0,1,0,2,2,2,1,],
        [1,0,0,0,1,8,4,1,],
        [1,1,1,1,1,1,1,1,],
    ],
    [
        [1,1,1,1,1,0,],
        [1,8,0,0,1,1,],
        [1,0,1,2,0,1,],
        [1,0,2|4,0,4,1,],
        [1,1,0,0,2,1,],
        [0,1,4,0,0,1,],
        [0,1,1,1,1,1,],
    ]
]

const history = [];
let map = [];
let nMoves=0;
const currentXY = {row:0, col:0};
let level = 0;
function resizeCanvas(){
    const {width, height} = ctx.canvas.getBoundingClientRect();
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    size_lab.size = ctx.canvas.height/map.length+1;
    size_lab.dX = (ctx.canvas.width - size_lab.size * map[0].length)/2
    drawMap();
}
let touchstartX = 0;
let touchendX = 0;
let touchstartY = 0;
let touchendY = 0;   

function checkDirection() {
    let difX = touchstartX - touchendX;
    let difY = touchstartY - touchendY;
    if (Math.abs(difX) > Math.abs(difY)) {
        if (touchendX < touchstartX) {//left
            currMove = moveLeft;
            check();    
            console.log("left");
        }
        if (touchendX > touchstartX) {//right
            currMove = moveRight;
            check();
            console.log("right");
        }
    } else {
        if (touchendY < touchstartY) {//up
            currMove = moveUp;
            check();    
            console.log("up");
        }
        if (touchendY > touchstartY) {//down
            currMove = moveDown;
            check();
            console.log("down");
        } 
    }
    
    
};


canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    touchstartX = e.changedTouches[0].screenX;
    touchstartY = e.changedTouches[0].screenY;
});

canvas.addEventListener('touchend', e => {
    e.preventDefault();
    touchendX = e.changedTouches[0].screenX;
    touchendY = e.changedTouches[0].screenY;
    checkDirection();
});

let img_man = new Image();
window.addEventListener('keydown', e =>{
    if(e.code === "KeyW" || e.code === "ArrowUp"){
        document.querySelector('.W').classList.add('active');
        currMove = moveUp;
        e.preventDefault();
        check();
    }
    if(e.code === "KeyA" || e.code === "ArrowLeft"){
        document.querySelector('.A').classList.add('active');
        currMove = moveLeft;
        check();
    }
    if(e.code === "KeyS" || e.code === "ArrowDown"){
        document.querySelector('.S').classList.add('active');
        currMove = moveDown;
        e.preventDefault();
        check();
    }
    if(e.code === "KeyD" || e.code === "ArrowRight"){
        document.querySelector('.D').classList.add('active');
        currMove = moveRight;
        check();
    }
    if(e.code === "KeyB" || (e.code === "KeyZ" && e.ctrlKey)){
        document.querySelector('.B').classList.add('active');
        if(history.length > 0){
            const hs = JSON.parse(history.pop());
            map[hs.r0][hs.c0] = hs.b0; 
            map[hs.r1][hs.c1] = hs.b1; 
            map[hs.r2][hs.c2] = hs.b2; 
            nMoves++;
        } 
        document.getElementById("spanMoves").innerHTML = history.length + "(" + nMoves +")";
        drawMap();
    }
    
});
window.addEventListener('keyup', e =>{
    if(e.code === "KeyW" || e.code === "ArrowUp"){
        document.querySelector('.W').classList.remove('active');
    }
    if(e.code === "KeyA" || e.code === "ArrowLeft"){
        document.querySelector('.A').classList.remove('active');
    }
    if(e.code === "KeyS" || e.code === "ArrowDown"){
        document.querySelector('.S').classList.remove('active');
    }
    if(e.code === "KeyD" || e.code === "ArrowRight"){
        document.querySelector('.D').classList.remove('active');
    }
    if(e.code === "KeyB" || (e.code === "KeyZ" && e.ctrlKey)){
        document.querySelector('.B').classList.remove('active');
    }
});

const startMove = () =>{
    if (!requestA) {
       requestA = window.requestAnimationFrame(step);
    }
}

const stopMove = () =>{
    if (requestA) {
        requestA = cancelAnimationFrame(requestA);
        requestA = undefined;
    }
}

const check = () => {
    startMove();
    //          x1 y1 x2 y2
    //l 0 00    -1  0 -2  0
    //r 1 01     1  0  2  0
    //u 2 10     0 -1  0 -2
    //d 3 11     0  1  0  2

    //currMove>>1 - verifica bitul din stanga
    //(currMove&1) * 2 - 1 - bitul din dreapta sa se obtina 1 sau -1
    col2 = currentXY.col + 2 * !(currMove>>1) * ((currMove&1) * 2 - 1);
    col1 = currentXY.col + !(currMove>>1) * ((currMove&1) * 2 - 1);
    row1 = currentXY.row + (currMove>>1) * ((currMove&1) * 2 - 1);
    row2 = currentXY.row + 2 * (currMove>>1) * ((currMove&1) * 2 - 1);
    
    if (row1 < 1 || col1 < 1 || row1 >= map.length || col1 >= map[currentXY.row]) return;
    
    if (map[row1][col1] === 1) return;

    

    const hs = {
        c0: currentXY.col,
        r0: currentXY.row,
        b0: map[currentXY.row][currentXY.col],
        c1: col1,
        r1: row1,
        b1: map[row1][col1],
        c2: col2,
        r2: row2,
        b2: map[row2][col2],
    };
    history.push(JSON.stringify(hs));
    // & face operantia and la fiecare bit
    if ((map[row1][col1]&2) === 2){
        if((map[row2][col2]&3) > 0) {
            history.pop();
            return;
        }
        
        map[row2][col2]|=2; //aduna pe biti(la pozitia urmatoare adauga 2(lada))
        map[row1][col1]^=2; //scade pe biti(la pozitia precedenta scade 2(lada))
    }
    
    map[currentXY.row][currentXY.col]^=8;
    map[row1][col1]|=8;
    nMoves++;
    
    drawMap();
    
    

    
}

const drawWall = (X, Y) =>{
    const x = size_lab.dX + X * size_lab.size;
    const y = Y * size_lab.size;
    ctx.beginPath(); 

    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "orange"; 

    for (let i = 0; i < 6; i++) {

        if(i%2 == 0){
            ctx.rect(x, y + i*size_lab.size/6, size_lab.size/2, size_lab.size/6);
            ctx.rect(x + size_lab.size/2, y + i*size_lab.size/6, size_lab.size/2, size_lab.size/6);
        }
        else{
            ctx.fillRect(x, y + i*size_lab.size/6, size_lab.size, size_lab.size/6);
            ctx.rect(x + size_lab.size/4, 
            y + i*size_lab.size/6, 
            size_lab.size/2, 
            size_lab.size/6);
        }
        ctx.fill();
        ctx.stroke();
    }
    ctx.moveTo(x, y  + size_lab.size);
    ctx.lineTo(x+size_lab.size, y+size_lab.size);
    ctx.stroke();

}

const drawBox = (X,Y) =>{
    const x = size_lab.dX + X * size_lab.size;
    const y = Y * size_lab.size;
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "brown";
    ctx.fillRect(x +5, 
        y +5, size_lab.size -10, size_lab.size -10);
    //обводка квадрата
    ctx.lineTo(x+5, y+5);
    ctx.lineTo(x+size_lab.size -5, y +5 );
    ctx.lineTo(x+size_lab.size -5, y +size_lab.size-5);
    ctx.lineTo(x + 5, y +size_lab.size-5);
    ctx.lineTo(x+5, y+5);
    //1 доска
    ctx.lineTo(x+5+size_lab.size/6,y+5);
    ctx.lineTo(x+size_lab.size -5, y +5*size_lab.size/6-5);
    ctx.lineTo(x+size_lab.size -5, y +size_lab.size-5);
    ctx.lineTo(x +5*size_lab.size/6 -5, y +size_lab.size-5);
    ctx.lineTo(x+5, y+size_lab.size/5+5);
    //2 доска
    ctx.lineTo(x+5, y+5*size_lab.size/6-5);
    ctx.lineTo(x+5*size_lab.size/6 -5, y +5 );
    ctx.lineTo(x+size_lab.size -5, y +5 );
    ctx.lineTo(x+size_lab.size -5, y +size_lab.size/6+5);
    ctx.lineTo(x +size_lab.size/6 + 5, y +size_lab.size-5);
    ctx.stroke();
}


const drawSize = (X, Y) =>{
    const x = size_lab.dX + X * size_lab.size;
    const y = Y * size_lab.size;
    ctx.beginPath(); 

    ctx.lineWidth = 4;
    ctx.strokeStyle = "green";
    ctx.moveTo(x, y  + 3 * size_lab.size / 4);
    ctx.lineTo(x, y+size_lab.size);
    ctx.lineTo(x+size_lab.size, y+size_lab.size);
    ctx.lineTo(x+size_lab.size, y+3*size_lab.size/4);
    ctx.stroke();

    ctx.lineWidth = 1;
    ctx.strokeStyle = "grey";
    ctx.rect(x + size_lab.size/3, 
            y + size_lab.size/3, 
            size_lab.size/3, 
            size_lab.size/3);
    ctx.moveTo(x + size_lab.size/2, y  + size_lab.size / 2);
    ctx.lineTo(x + size_lab.size/2, y+9*size_lab.size/10);
    ctx.lineTo(x + 2*size_lab.size/5, y+4*size_lab.size/5);
    ctx.lineTo(x + 3*size_lab.size/5, y+4*size_lab.size/5);
    ctx.lineTo(x + size_lab.size/2, y+9*size_lab.size/10);
    ctx.stroke();
     

}

const step = (X,Y) =>{
    requestA = undefined;

    frameCount++;
    if (frameCount < 6) {
        startMove();
        return;
    }
    frameCount = 0;
    drawMan(currentXY.col, currentXY.row, cycleLoop[cycleIndex]);
    cycleIndex++;
    if (cycleIndex >= cycleLoop.length) {
        cycleIndex = 0;
    }
    startMove();
}
const drawMan = (X, Y, fr) =>{
    const x = size_lab.dX + X * size_lab.size;
    const y = Y * size_lab.size;
    ctx.beginPath();
    if (currMove == moveDown) {
        ctx.clearRect(x, y, size_lab.size, size_lab.size);
        ctx.drawImage(img_man, fr*452+20, 0, /*сколько отсчитать от начальной точки*/460, 550/**/, x, y, size_lab.size, size_lab.size);
    }
    if (currMove ==moveRight) {
        ctx.clearRect(x, y, size_lab.size, size_lab.size);
        ctx.drawImage(img_man, fr*452, 600, /*сколько отсчитать от начальной точки*/460, 550/**/, x, y, size_lab.size, size_lab.size);
    }
    if (currMove == moveLeft) {
        ctx.clearRect(x, y, size_lab.size, size_lab.size);
        ctx.drawImage(img_man, fr*452, 1200, /*сколько отсчитать от начальной точки*/460, 580/**/, x, y, size_lab.size, size_lab.size);
    }
    if (currMove == moveUp) {
        ctx.clearRect(x, y, size_lab.size, size_lab.size);
        ctx.drawImage(img_man, fr*452+15, 1850, /*сколько отсчитать от начальной точки*/460, 550/**/, x, y, size_lab.size, size_lab.size);
    }
}
const drawMap = () => {
    ctx.beginPath();
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
    ctx.stroke();
    const size_x = ctx.canvas.width/map[0].length;
    const size_y = ctx.canvas.height/map.length;

    let box = boxFix = 0;

    for(let y = 0; y < map.length; y++){
        for (let x = 0; x < map[y].length; x++) {
            
            if(map[y][x]&1){
                drawWall(x, y);
            }
            
            if(map[y][x]&4){
                if(map[y][x]&2) boxFix++;
                drawSize(x, y);
            }

            if(map[y][x]&2){
                box++;
                drawBox(x,y);
            }

            if(map[y][x]&8){
                drawMan(x,y, 0);
                currentXY.row=y;
                currentXY.col=x;
            }
        }
    }
    setTimeout(stopMove, 400);
    document.getElementById("spanBox").innerHTML = boxFix + "/" + box;
    document.getElementById("spanMoves").innerHTML = history.length + "(" + nMoves +")";
    
    if(boxFix == box) win();
}

const startGame = (lab) =>{
    
    const tlab = localStorage.getItem("current level");
    if(tlab) level = +tlab;

    document.getElementById("spanN").innerHTML = (level+1);
    map = JSON.parse(JSON.stringify(totalMap[level]));
    img_man.src = 'img/cropped.png';
    img_man.onload = function () {
        resizeCanvas()
    }
    
}
const buttonBack = document.querySelector(".choose__level__back");
const buttonNext = document.querySelector(".choose__level__next");

buttonBack.addEventListener("mouseup", function(ev) {
    if(level <= 0) {
        return;
    }
    else {
        level--;
        console.log(level);
        history.length = 0;
        nMoves = 0;
        localStorage.setItem("current level", level);
        startGame(level);
        
    }
});
buttonNext.addEventListener("mouseup", function(ev) {
    if(level >= totalMap.length-1) {
        return;
    }
    else {
        level++;
        console.log(level);
        history.length = 0;
        nMoves = 0;
        localStorage.setItem("current level", level);
        startGame(level);
        
    }
});
const win = () => {
    
    document.querySelector('.win').classList.add('active');
    level++;
    setTimeout( () => {
        history.length = 0;
        nMoves = 0;
        localStorage.setItem("current level", level);
        document.querySelector('.win').classList.remove('active');
        startGame(level);
    }, 2000);
    if (totalMap.length <= level) {
        level--;
        document.querySelector('.end').classList.add('active');
    }
}
startGame();