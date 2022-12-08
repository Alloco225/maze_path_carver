let rows;
let cols;

let gridSize = 30;

let grid = [];
let cellStack = [];
let currentCell;

let fullScreen = true;

let config = {
    frameRate: 65,
    yellow: [100, 76, 23],
    orange: [255, 110, 64],
    blue: [12, 24, 35],
};

function setup() {
    if (fullScreen) {
        createCanvas(windowWidth, windowHeight);
    } else {
        createCanvas(400, 600);
    }
    cols = floor(width / gridSize);
    rows = floor(height / gridSize);

    for (var j = 0; j < rows; j++) {
        for (var i = 0; i < cols; i++) {
            grid.push(new Cell(i, j));
        }
    }

    currentCell = grid[0];
    currentCell.checkNeighbors();
}

function draw() {
    background(100);
    // frameRate(config.frameRate);

    for (var j = 0; j < grid.length; j++) {
        grid[j].show();
    }

    currentCell.visited = true;
    currentCell.highlight();
    //
    generateMaze();

    keyControls();
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight)
}

function index(i, j) {
    if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
        return -1;
    }
    return i + j * cols;
}

function mazeGenerationPercentage() {
    let perc = (grid.filter((cell) => cell.visited == true).length * 100) / grid.length;
    return perc.toPrecision(2);
}
function isMazeGenerated() {
    return grid.filter((cell) => cell.visited == true).length == grid.length;
}

function keyControls() {
    console.log(">> keyControls");
    let target = currentCell;
    if (keyCode === UP_ARROW) {
        console.log(">> up");
        target = grid[index(currentCell.i, currentCell.j - 1)];
        if (target && !currentCell.walls[0]) {
            currentCell = target;
        }
    }

    if (keyCode === RIGHT_ARROW) {
        console.log(">> right");

        target = grid[index(currentCell.i + 1, currentCell.j)];

        if (target && !currentCell.walls[1]) {
            currentCell = target;
        }
    }

    if (keyCode === DOWN_ARROW) {
        console.log(">> down");

        target = grid[index(currentCell.i, currentCell.j + 1)];
        if (target && !currentCell.walls[2]) {
            currentCell = target;
        }
    }
    if (keyCode === LEFT_ARROW) {
        console.log(">> left");

        // currentCell.i--
        target = grid[index(currentCell.i - 1, currentCell.j)];
        if (target && !currentCell.walls[3]) {
            currentCell = target;
        }
    }
}

// function keyPressed() {
//     if (isMazeGenerated()) keyControls();
// }



function removeWalls(cellA, cellB) {
    let x = cellA.i - cellB.i;
    if (x == 1) {
        cellA.walls[3] = false;
        cellB.walls[1] = false;
    }
    if (x == -1) {
        cellA.walls[1] = false;
        cellB.walls[3] = false;
    }
    let y = cellA.j - cellB.j;
    if (y == 1) {
        cellA.walls[0] = false;
        cellB.walls[2] = false;
    }
    if (y == -1) {
        cellA.walls[2] = false;
        cellB.walls[0] = false;
    }
    console.log(">> x", x, " y", y);
}

function generateMaze(){
  let nextCell = currentCell.checkNeighbors();
  if (nextCell) {
      nextCell.visited = true;
      cellStack.push(currentCell);
      removeWalls(currentCell, nextCell);
      currentCell = nextCell;
  } else if (cellStack.length > 0) {
      currentCell = cellStack.pop();
  }

  if (mazeGenerationPercentage() < 100) {
      console.log(">> completion : ", mazeGenerationPercentage(), "%");
  }
}

function Cell(i, j) {
    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true];
    this.visited = false;

    var x = this.i * gridSize;
    var y = this.j * gridSize;

    this.checkNeighbors = function () {
        let neighbors = [];

        var top = grid[index(i, j - 1)];
        var right = grid[index(i + 1, j)];
        var bottom = grid[index(i, j + 1)];
        var left = grid[index(i - 1, j)];

        if (top && !top.visited) {
            neighbors.push(top);
        }
        if (right && !right.visited) {
            neighbors.push(right);
        }
        if (bottom && !bottom.visited) {
            neighbors.push(bottom);
        }
        if (left && !left.visited) {
            neighbors.push(left);
        }

        if (neighbors.length > 0) {
            var r = floor(random(0, neighbors.length));
            return neighbors[r];
        }

        return undefined;
    };

    this.highlight = function () {
        // fill(0, 0, 255, 100)
        // fill()
        noStroke();
        fill(config.orange);
        rect(x +5, y + 5, gridSize -10, gridSize -10);
    };

    ///
    this.show = function () {
        stroke(255);
        // strokeWeight(4);
        if (this.walls[0]) {
            line(x, y, x + gridSize, y);
        }
        if (this.walls[1]) {
            line(x + gridSize, y, x + gridSize, y + gridSize);
        }
        if (this.walls[2]) {
            line(x + gridSize, y + gridSize, x, y + gridSize);
        }
        if (this.walls[3]) {
            line(x, y + gridSize, x, y);
        }

        if (this.visited) {
            noStroke();
            // fill(255, 0, 250, 100);
            fill(config.blue);
            rect(x, y, gridSize, gridSize);
        }
    };
}
