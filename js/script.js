var n = 8;
var numRows = n;
var numCols = n;
var settingNum = 1;

var sounds = emptyBoard([numRows, numCols]);
var soundFiles = ["a0.mp3",
"a1.mp3",
"a2.mp3",
"a3.mp3",
"a5.mp3",
"a6.mp3",
"a7.mp3",
"a9.mp3",
"a10.mp3",
"a11.mp3",
"a12.mp3",
"a13.mp3",
"a14.mp3",
"a15.mp3",
"b0.mp3",
"b1.mp3",
"b2.mp3",
"b3.mp3",
"b4.mp3",
"b5.mp3",
"b6.mp3",
"b7.mp3",
"b8.mp3",
"b9.mp3",
"b10.mp3",
"b11.mp3",
"b12.mp3",
"b13.mp3",
"b14.mp3",
"b15.mp3",
"c1.mp3",
"c2.mp3",
"c3.mp3",
"c5.mp3",
"c6.mp3",
"c7.mp3",
"d0.mp3",
"d1.mp3",
"d2.mp3",
"d3.mp3",
"d4.mp3",
"d5.mp3",
"d6.mp3",
"d8.mp3",
"d12.mp3",
"e0.mp3",
"e1.mp3",
"catchmeoutside.mp3",
"kanye0.mp3",
"kanye1.mp3",
"kanye2.mp3",
"kanye3.mp3",
"kanye4.mp3",
"kanye5.mp3",
"panda0.mp3",
"migos0.mp3",
"migos1.mp3"];

soundFiles = shuffle(soundFiles);

var board = emptyBoard([numRows, numCols]);

var canvasWidth = 400;
var canvasHeight = 400;
var cellWidth = canvasWidth / numCols;
var cellHeight = canvasHeight / numRows;

var chance = 0.33;

var nextButton = document.getElementById("nextButton");
var tickButton = document.getElementById("tickButton");
var clearButton = document.getElementById("clearButton");
var randomButton = document.getElementById("randomButton");
var gameButton = document.getElementById("gameButton");
var settingsButton = document.getElementById("settingsButton");
var enterCellButton = document.getElementById("enterCellButton");
var enterSoundButton = document.getElementById("enterSoundButton");
var cellInput = document.getElementById("cellInput");
var soundInput = document.getElementById("soundInput")
var canvas = document.getElementById("canvas");
var soundboard = document.getElementById("soundboard");
var display = document.getElementById("display");
var settings = document.getElementById("settings");
settings.style.display = 'none';
var ctx = canvas.getContext("2d");
var soundboardctx = soundboard.getContext("2d");

ctx.fillStyle = "#000000";
soundboardctx.fillStyle = "#000000";

drawBoard();
initSounds();
initSettings();

var mousePressed = false;
var mouseButton = '';
var lastX, lastY;

var interval = null;
var isTicking = false;
var tempo = 3; // bps
var tickInterval = 1 / tempo * 1000; // ms


nextButton.addEventListener("click", function() {
    next();
}, false);

tickButton.addEventListener("click", function() {
    if (!isTicking) {
        interval = setInterval(next, tickInterval);
    } else {
        clearInterval(interval);
    }
    isTicking = !isTicking;
}, false);

clearButton.addEventListener("click", function() {
    clear();
}, false);

randomButton.addEventListener("click", function() {
    for (var r = 0; r < numRows; r++) {
        for (var c = 0; c < numRows; c++) {
            if (Math.random() < chance) {
                drawCell(r, c, false, ctx);
            }
        }
    }
}, false);

gameButton.addEventListener("click", function() {
    settings.style.display = 'none';
    display.style.display = 'block';
}, false);

settingsButton.addEventListener("click", function() {
    display.style.display = 'none';
    settings.style.display = 'block';
}, false);

enterCellButton.addEventListener("click", function() {
    eraseCell(Math.floor((settingNum - 1) / numCols), (settingNum - 1) % numCols, false, soundboardctx);
    settingNum = cellInput.value;
    soundInput.value = soundFiles[settingNum - 1];
    drawCell(Math.floor((settingNum - 1) / numCols), (settingNum - 1) % numCols, false, soundboardctx);
}, false);

enterSoundButton.addEventListener("click", function() {
    eraseCell(Math.floor((settingNum - 1) / numCols), (settingNum - 1) % numCols, false, soundboardctx);
    settingNum = cellInput.value;
    drawCell(Math.floor((settingNum - 1) / numCols), (settingNum - 1) % numCols, false, soundboardctx);
    soundFiles[settingNum - 1] = soundInput.value;
})

document.addEventListener("keypress", function(event) {
    if (event.which == 99) {
        clear();
    } else if (event.which == 110 || event.which == 32) {
        next();
    } else if (event.which == 116) {
        if (!isTicking) {
            interval = setInterval(next, tickInterval);
        } else {
            clearInterval(interval);
        }
        isTicking = !isTicking;
    }
}, false);

// event listeners to draw on the canvas
canvas.addEventListener("mousedown", function(event) {
    if (isTicking) {
        isTicking = false;
        clearInterval(interval);
    }
    mousePressed = true;
    if (event.button == 0) {
        mouseButton = 'left';
    } else if (event.button == 2) {
        mouseButton = 'right';
    }
    var x = event.pageX - canvas.offsetLeft;
    var y = event.pageY - canvas.offsetTop;
    if (mouseButton == 'left') {
        drawCell(y, x, true, ctx);
    } else if (mouseButton == 'right') {
        eraseCell(y, x, true, ctx);
    }
}, false);

canvas.addEventListener("mousemove", function(event) {
    if (mousePressed) {
        var x = event.pageX - canvas.offsetLeft;
        var y = event.pageY - canvas.offsetTop;
        if (mouseButton == 'left') {
            drawCell(y, x, true, ctx);
        } else if (mouseButton == 'right') {
            eraseCell(y, x, true, ctx);
        }
    }
}, false);

canvas.addEventListener("mouseup", function(event) {
    mousePressed = false;
}, false);

canvas.addEventListener("mouseleave", function(event) {
    mousePressed = false;
}, false);

function next() {
    getNextBoard();
    drawBoard();
}

function clear() {
    board = emptyBoard([numRows, numCols]);
    drawBoard();
}

// getNextBoard replaces the current board with the next iteration
function getNextBoard() {
    var isSame = true;
    var newBoard = emptyBoard([numRows, numCols]);
    for (var r = 0; r < numRows; r++) {
        for (var c = 0; c < numCols; c++) {
            newBoard[r][c] = cellStep(r, c, board[r][c]);
            if (newBoard[r][c] != board[r][c]) {
                isSame = false;
            }
            if (newBoard[r][c]) {
                sounds[r][c].play();
            }
        }
    }
    board = newBoard;
    if (isSame) {
        clear();
    }
}

// cellStep gives the next state of a cell given its row, column, and status
function cellStep(row, col, isAlive) {
    var numNeighbors = getNumNeighbors(row, col);
    if (isAlive) {
        if (numNeighbors == 2 || numNeighbors == 3) {
            return true;
        } else {
            return false;
        }
    } else {
        if (numNeighbors == 3) {
            return true;
        } else {
            return false
        }
    }
}

// getNumNeighbors gets the number of alive cells neighboring a given cell
function getNumNeighbors(row, col) {
    var numNeighbors = 0;
    for (var r = row - 1; r <= row + 1; r++) {
        for (var c = col - 1; c <= col + 1; c++) {
            if (checkBounds(r, c)) {
                if (!(r == row && c == col)) {
                    numNeighbors += board[r][c];
                }
            }
        }
    }
    return numNeighbors;
}

// checkBounds checks array out of bounds exception
function checkBounds(row, col) {
    if (row < 0 || row >= numRows || col < 0 || col >= numCols ) {
        return false;
    } else {
        return true;
    }
}

// drawBoard clears the old board and draws the current board
function drawBoard() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    for (var r = 0; r < numRows; r++) {
        for (var c = 0; c < numCols; c++) {
            if (board[r][c] == 1) {
                drawCell(r, c, false, ctx);
            } else {
                eraseCell(r, c, false, ctx);
            }
        }
    }
}

// drawCell creates an alive cell in a row / column
function drawCell(row, col, isCanvasXY, boardType) {
    if (isCanvasXY) {
        row = Math.floor(row / cellHeight);
        col = Math.floor(col / cellWidth);
    }
    if (boardType == ctx) {
        board[row][col] = 1;
        sounds[row][col].play(); // remove if necessary
    }
    var canvasX = col * cellWidth;
    var canvasY = row * cellHeight;

    var centerX = canvasX + cellWidth / 2;
    var centerY = canvasY + cellHeight / 2;
    var outterRadius = cellHeight / 2.5;
    var innerRadius = cellHeight / 3.0;

    boardType.fillStyle = "#000000"
    boardType.beginPath();
    boardType.arc(centerX, centerY, outterRadius, 0, 2 * Math.PI);
    boardType.fill();

    boardType.fillStyle = "#FFFFFF";
    boardType.beginPath();
    boardType.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    boardType.fill();
}

// eraseCell kills an alice cell in a row / column
function eraseCell(row, col, isCanvasXY, boardType) {
    if (isCanvasXY) {
        row = Math.floor(row / cellHeight);
        col = Math.floor(col / cellWidth);
    }
    if (boardType == ctx) {
        board[row][col] = 0;
    }
    var canvasX = col * cellWidth;
    var canvasY = row * cellHeight;

    var centerX = canvasX + cellWidth / 2;
    var centerY = canvasY + cellHeight / 2;
    var outterRadius = cellHeight / 2.5;
    var innerRadius = cellHeight / 3.0;

    // clear circle
    boardType.fillStyle = "#FFFFFF";
    boardType.beginPath();
    boardType.arc(centerX, centerY, outterRadius, 0, 2 * Math.PI);
    boardType.fill();

    boardType.fillStyle = "#000000"
    boardType.beginPath();
    boardType.arc(centerX, centerY, outterRadius, 0, 2 * Math.PI);
    boardType.stroke();

    boardType.fillStyle = "#000000"
    boardType.beginPath();
    boardType.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    boardType.stroke();
}

// emptyBoard returns and 2d array of zeros
function emptyBoard(dimensions) {
    var array = [];
    for (var i = 0; i < dimensions[0]; ++i) {
        array.push(dimensions.length == 1 ? 0 : emptyBoard(dimensions.slice(1)));
    }
    return array;
}

function initSounds() {
    for (var r = 0; r < numRows; r++) {
        for (var c = 0; c < numRows; c++) {
             sounds[r][c] = new Audio("sounds/" + soundFiles[r * numCols + c]);
        }
    }
}

function initSettings() {
    cellInput.value = settingNum;
    soundInput.value = soundFiles[settingNum - 1];
    soundboardctx.clearRect(0, 0, canvasWidth, canvasHeight);
    for (var r = 0; r < numRows; r++) {
        for (var c = 0; c < numCols; c++) {
            if (r * numCols + c + 1 == settingNum) {
                drawCell(r, c, false, soundboardctx);
            } else {
                eraseCell(r, c, false, soundboardctx);
            }
        }
    }
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
