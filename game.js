var board;
var score = 0;
var rows = 4;
var columns = 4;
let initialBoardState;

window.onload = function() {
    setGame();
}

function setGame() {

    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    /* test all colours
    board = [
        [2, 4, 8, 16],
        [256, 128, 64, 32],
        [512, 1024, 2048, 4096],
        [8192, 0, 0, 0]
    ]
    */

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            //<div id="0-0"></div>
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }

    // Spawn 2 tiles at the start of game
    spawnTile();
    spawnTile();
}

function hasEmptyTile() {

    // Iterate over all rows and columns
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {

            // If tile == 0 (is empty)
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}


function spawnTile() {

    // Return if tile is not empty
    if (!hasEmptyTile()) {
        return;
    }

    let found = false;
    while (!found) {
        // Random row and column
        let r = Math.floor(Math.random() * rows); // Random rounded number between 0-1 * 4
        let c = Math.floor(Math.random() * columns); // Random rounded number between 0-1 * 4

        if (board[r][c] == 0) {
            board[r][c] = 2;

            // Update HTML
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

// Check if board states before and after keypress are equal
function boardsAreEqual(board1, board2) {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board1[r][c] !== board2[r][c]) {
                return false;
            }
        }
    }
    return true;
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = ""; // Clear the classList
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num;
        if (num <= 4096) {
            tile.classList.add("x" + num.toString()); // Set class to (x + the tile number)
        } else {
            tile.classList.add("x8192"); // 8192 and larger will have the same class
        }
    }
}

// Controls
document.addEventListener("keyup", (e) => {
    // Store the current board state
    initialBoardState = JSON.parse(JSON.stringify(board));

    if (e.code == "ArrowLeft") {
        slideLeft();
    } else if (e.code == "ArrowRight") {
        slideRight();
    } else if (e.code == "ArrowUp") {
        slideUp();
    } else if (e.code == "ArrowDown") {
        slideDown();
    }

    // Check if any move was made by comparing board states
    if (!boardsAreEqual(initialBoardState, board)) {
        spawnTile();
    }

    // Update score
    document.getElementById("score").innerText = score;
})

// Create a new arrary without 0s
function filterZero(row) {
    return row.filter(num => num != 0);
}

function slide(row) {
    row = filterZero(row); // Get rid of 0s

    // Slide
    for (let i = 0; i < row.length - 1; i++) {
        // Check every 2
        if (row[i] == row[i + 1]) {

            // Double tile value
            row[i] *= 2;
            row[i + 1] = 0;

            // Update score with doubled value
            score += row[i];
        }
    }

    row = filterZero(row);


    // Restore 0s in empty indicies
    while (row.length < columns) {
        row.push(0);
    }

    return row;
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;

        // Update board in HTML
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}




// Sliding right is horizontally reversing the array, sliding LEFT and then reversing it again
function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;

        // Update board in HTML
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}



// Sliding up is turning the column -25°, sliding LEFT and then turning 25°.
function slideUp() {
    for (let c = 0; c < columns; c++) {
        // Get an array of 1 index of from row
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        board[0][c] = row[0];
        board[1][c] = row[1];
        board[2][c] = row[2];
        board[3][c] = row[3];

        // Update board in HTML
        for (let r = 0; r < columns; r++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}


// Sliding down is reversing the array, sliding UP and then reversing it again
function slideDown() {
    for (let c = 0; c < columns; c++) {
        // Get an array of 1 index of from row
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse()
        row = slide(row);
        row.reverse()

        // Update board in HTML
        for (let r = 0; r < columns; r++) {
            board[r][c] = row[r]; //
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}


// Mobile controls
document.addEventListener("touchstart", handleTouchStart);
document.addEventListener("touchmove", handleTouchMove);
document.addEventListener("touchend", handleTouchEnd);

let touchStartX = 0;
let touchStartY = 0;

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    event.preventDefault(); // Prevent scrolling

    // Do nothing if no touchstart coordinates were recorded
    if (!touchStartX || !touchStartY) {
        return;
    }

    let touchEndX = event.touches[0].clientX;
    let touchEndY = event.touches[0].clientY;

    let dx = touchEndX - touchStartX;
    let dy = touchEndY - touchStartY;

    // Determine direction of swipe
    if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (dx > 0) {
            // Swipe right
            handleMove({
                type: "swiperight"
            });
        } else {
            // Swipe left
            handleMove({
                type: "swipeleft"
            });
        }
    } else {
        // Vertical swipe
        if (dy > 0) {
            // Swipe down
            handleMove({
                type: "swipedown"
            });
        } else {
            // Swipe up
            handleMove({
                type: "swipeup"
            });
        }
    }

    // Reset touch start coordinates
    touchStartX = 0;
    touchStartY = 0;
}

function handleTouchEnd(event) {
    touchStartX = 0;
    touchStartY = 0;
}

function handleMove(event) {
    initialBoardState = JSON.parse(JSON.stringify(board));

    switch (event.type) {
        case "swipeleft":
            slideLeft();
            break;
        case "swiperight":
            slideRight();
            break;
        case "swipeup":
            slideUp();
            break;
        case "swipedown":
            slideDown();
            break;
    }

    if (!boardsAreEqual(initialBoardState, board)) {
        spawnTile();
    }

    document.getElementById("score").innerText = score;
}
