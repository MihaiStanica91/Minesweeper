const container = document.getElementById("grid");
var board = [];
var cellValue = [];
var numberOfBombs = 0;
var numberLines = 0;
var numberCols = 0;
var numberBombs = 0;
var numberOfFlags = 0;

function startGame(rows, cols, bombs) { // start a new game and sets the diffifculty
    numberLines = rows;
    numberCols = cols;
    numberBombs = bombs;
    numberOfFlags = bombs;
    if (buttonsDifficulty.style.display == "block" && restartButton.style.display == "none") {
        buttonsDifficulty.style.display = "none";
        restartButton.style.display = "block";
    }
    makeBoard();
}

function makeBoard() { //create the board game
    container.style.setProperty("--size", numberLines);
    container.style.setProperty("--size", numberCols);
    container.style.setProperty("width", "fit-content");

    for (let x = 0; x < numberLines; ++x) {
        board[x] = [];
        cellValue[x] = [];
        for (let y = 0; y < numberCols; ++y) {
            board[x][y] = 0; //when the board is created, all cells have value 0
            cellValue[x][y] = 1; //unclicked cells have value 1
            let cell = document.createElement("button");
            cell.type = "button";
            let idCell = x.toString() + "." + y.toString();
            cell.id = idCell;
            cell.setAttribute("style", "background-color: grey");
            container.appendChild(cell).className = "grid-item"; 

            cell.onclick = function() {checkCell(x, y)};
        }
    }
    setBombs(numberBombs);
    setValuesAroundBombs();
}

function setValuesAroundBombs() { //sets the values around a bomb
    for (let x = 0; x < numberLines; ++x) {
        for (let y = 0; y < numberCols; ++y) {
            if (board[x][y] == -1) {
                for (let xOffSet = -1; xOffSet <= 1; ++xOffSet) {
                    for (let yOffSet = -1; yOffSet <= 1; ++yOffSet) {
                        if (x + xOffSet >= 0 && x + xOffSet < numberLines && y + yOffSet >= 0 && y + yOffSet < numberCols && board[x + xOffSet][y + yOffSet] != -1) {
                            ++board[x + xOffSet][y + yOffSet];
                        }
                    }
                }
            }
        }
    }
}

function setBombs(numberBombs) { // places the bombs randomly on board
    while (numberBombs > 0) {
        let row = Math.floor(Math.random() * (numberLines - 0) + 0);
        let col = Math.floor(Math.random() * (numberCols - 0) + 0);
        if (board[row][col] != -1) {
            board[row][col] = -1; //bomb-cells have value -1
            --numberBombs;
        }
    }
}

function checkCell(x, y) { // checks what type of cell was clicked (bomb-cell or number-cell)
    if (board[x][y] == 0 && cellValue[x][y] == 1) {
        revealCells(x, y);
    } else if (board[x][y] > 0 && cellValue[x][y] == 1) {
        showCell(x, y);
        cellValue[x][y] = 0;
    } else if ( board[x][y] == -1 && cellValue[x][y] == 1) {
        endGame();
    }
    checkWin();
}

function revealCells(x, y) { //reveals all the cells
    for (let indexRow = x - 1; indexRow <= x + 1; ++indexRow) {
        for (let indexCol = y - 1; indexCol <= y + 1; ++indexCol) {
            if (indexRow >= 0 && indexCol >= 0 && indexRow < numberLines && indexCol < numberCols) {
                if (board[indexRow][indexCol] >= 0 && cellValue[indexRow][indexCol] == 1) {
                    cellValue[indexRow][indexCol] = 0; //clicked cells have value 0
                    showCell(indexRow, indexCol);
                    if (board[indexRow][indexCol] == 0) {
                        revealCells(indexRow, indexCol);
                    }
                }
            }
        }
    }
}

function showCell(x, y) { // displays the cell's value (bomb or number)
    let idCell = x.toString() + "." + y.toString();
    let cell = document.getElementById(idCell);
    if (board[x][y] == -1) {
        cell.setAttribute("style", "background-color: red")
    } else {
        cell.setAttribute("style", "background-color: lightgrey")
        cell.innerHTML = board[x][y];
    }
}

function checkWin() { //checks if you've won the game
    let numberOfCellsRevealed = 0;
    for (let x = 0; x < numberLines; ++x) {
        for (let y = 0; y < numberCols; ++y) {
            if (cellValue[x][y] == 0) {
                ++numberOfCellsRevealed;
            }
        }
    }
    if (numberOfCellsRevealed == (numberLines * numberCols) - numberBombs && lostMessage.style.display == "none") {
        wonMessage.style.display = "block";
    }
}

function endGame() { // checks if you've lost the game
    for (let x = 0; x < numberLines; ++x) {
        for (let y = 0; y < numberCols; ++y) {
            if (board[x][y] == -1) {
                showCell(x, y);
            }
        }
    }
    if (wonMessage.style.display == "none") {
        lostMessage.style.display = "block";
    }
}

function restartGame() {
    location.reload();
}