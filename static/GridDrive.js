import { Cell } from "./cells/Cell.js";
import { CellType } from "./cells/CellType.js";
import { TreeFactory } from "./trees/TreeFactory.js";


export class GridDrive {
    cellArray = [];
    height;
    width;
    canvas;

    constructor(canvas, height, width, color) {
        this.canvas = canvas;
        this.height = height;
        this.width = width;
        this.color = color;
    }

    initEmpty() {
        for (let i = 0; i < this.height; i++) {
            const row = []
            for (let j = 0; j < this.width; j++) {
                row.push("empty")
            }
            this.cellArray.push(row)
        }
    }

    addCell(cell) {
        if (cell instanceof Cell) {
            let yCord = this.fixCoordY(cell.y)

            if (this.coordInRange(cell.x, yCord)) {
                if (this.cellArray[cell.x][yCord] === "empty") {
                    cell.y = yCord;
                    this.cellArray[cell.x][yCord] = cell;
                } else {
                    cell.alive = false;
                }
            }
        }
    }

    removeCell(cell) {
        if (cell instanceof Cell) {
            if (this.coordInRange(cell.x, cell.y)) {
                if (this.cellArray[cell.x][cell.y] === cell) {
                    this.cellArray[cell.x][cell.y] = "empty";
                }
            }
        }
    }

    moveCell(cell, newX, newY) {
        if (cell instanceof Cell) {
            if (this.coordInRange(cell.x, cell.y)) {
                if (!(cell.x === newX && cell.y === newY)) {

                    if (this.cellArray[newX][newY] === "empty") {
                        this.cellArray[cell.x][cell.y] = "empty"
                        this.cellArray[newX][newY] = cell;
                        cell.move(newX, newY)
                    } else {
                        this.cellArray[cell.x][cell.y] = "empty"
                        cell.remove()
                    }
                }
            }
        }
    }

    renderInTable() {
        this.clearGrid();
        for (let r = 0; r < this.height; r++) {
            const row = this.canvas.insertRow(r);
            for (let c = 0; c < this.width; c++) {
                const cell = row.insertCell(c);
                if (this.cellArray[r][c] instanceof Cell) {
                    let lifeCell = this.cellArray[r][c]

                    let energy = this.giveEnergy(lifeCell);
                    if (energy < 20) {
                        energy = 0
                    } else if (energy < 50) {
                        energy = 20
                    } else if (energy < 100) {
                        energy = 50
                    } else {
                        energy = 120
                    }


                    switch (lifeCell.getType()) {
                        case CellType.Seed:
                            cell.setAttribute("style", `background-color: RGB(45,57,143)`);
                            break;
                        case CellType.Usual:
                            cell.setAttribute("style", `background-color: RGB(${energy},${energy},${energy})`);
                            break;
                        case CellType.Active:
                            cell.setAttribute("style", `background-color: RGB(143,45,45)`);
                            break;
                    }



                    this.serveSeeds(lifeCell);
                }
            }
        }
    }

    renderMock() {
        for (let r = 0; r < this.height; r++) {
            for (let c = 0; c < this.width; c++) {
                if (this.cellArray[r][c] instanceof Cell) {
                    let lifeCell = this.cellArray[r][c];

                    this.giveEnergy(lifeCell);

                    this.serveSeeds(lifeCell);
                }
            }
        }
    }

    serveSeeds(lifeCell) {

        if (lifeCell.getType() === CellType.Seed && !lifeCell.getTree().isAlive()) {
            if (lifeCell.x === (this.height - 1) && !this.isCoordsHasCell(lifeCell.x - 1, lifeCell.y)) {

                if (!this.isCoordsHasCell(lifeCell.x, lifeCell.y - 1) &&
                    !this.isCoordsHasCell(lifeCell.x, lifeCell.y + 1)) {

                    let tree = new TreeFactory().createTreeFromSeed(lifeCell, this)
                    this.envDrive.addTree(tree);
                    lifeCell.remove();

                } else {
                    if (Math.floor(Math.random() * 5) === 1) {
                        lifeCell.remove();
                    }
                }
            }
            if (this.coordInRange(lifeCell.x + 1, lifeCell.y)) {
                this.moveCell(lifeCell, lifeCell.x + 1, lifeCell.y);
            }
        }
    }


    giveEnergy(cell) {
        if (cell.getType() === CellType.Usual) {
            let energyMass = ((this.height + 3) - cell.x);

            let clearEnergy = energyMass + 5;

            let winPercent = 3

            for (let i = cell.x - 1; i >= 0; i--) {
                if (winPercent === 0) {
                    break;
                }
                if (this.cellArray[i][cell.y] instanceof Cell) {
                    winPercent--;
                }
            }
            cell.giveEnergy(clearEnergy * winPercent);
            return clearEnergy * winPercent;
        }
    }

    clearGrid() {
        while (this.canvas.firstChild) {
            this.canvas.removeChild(this.canvas.firstChild);
        }
    }


    fixCoordY(y) {
        if (y > (this.width - 1)) {
            y = y - (this.width - 1)
        } else if (y < 0) {
            y = (this.width - 1) + y
        }
        return y;
    }

    coordInRange(x, y) {
        return ((x >= 0) && (y >= 0)) &&
            ((x < this.cellArray.length) && (y < this.cellArray[0].length));
    }

    isCoordsHasCell(x, y) {
        if (this.coordInRange(x, y)) {
            return this.cellArray[x][y] != "empty"
        } else {
            return true
        }
    }

}