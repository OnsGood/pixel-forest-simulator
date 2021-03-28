import { Cell } from "./cells/Cell.js";
import { CellType } from "./cells/CellType.js";
import { TreeFactory } from "./trees/TreeFactory.js";


export class GridDrive {
    cellArray = [];


    constructor(stage, height, width, cellSize) {
        this.stage = stage;
        this.height = height;
        this.width = width;

        this.cellHeight = height / cellSize;
        this.cellWidth = width / cellSize;

        this.cellSize = cellSize;
    }

    initEmpty() {
        for (let y = this.height - this.cellSize; y >= 0; y = (y - this.cellSize)) {
            let yst = []
            for (let x = 0; x < this.width; x = (x + this.cellSize)) {
                let rect = this.stage.rect(x, y, this.cellSize, this.cellSize)
                    .fill('white').stroke('white');
                yst.push([rect, "empty"]);
            }
            this.cellArray.push(yst)
        }
        this.cellArray = this.cellArray[0].map((_, colIndex) => this.cellArray.map(row => row[colIndex]));
    }

    changeCellColor(cell) {
        if (cell && cell.isAlive() && this.cellArray[cell.x][cell.y]) {
            this.cellArray[cell.x][cell.y][0].fill(cell.getType().color);
        }
    }

    addCell(cell) {
        if (cell instanceof Cell && cell.isAlive()) {
            let yCord = cell.y
            let xCord = this.fixCoordX(cell.x)
            cell.x = xCord;

            //console.log(`x = ${xCord} , y = ${yCord} `)
            if (this.coordInRange(xCord, yCord) && this.cellArray[xCord][yCord][1] === "empty") {
                this.cellArray[xCord][yCord][1] = cell;
                this.cellArray[xCord][yCord][0].fill(cell.getType().color);
                //console.log(`type = ${cell.getType().color}`)
            } else {
                cell.remove()
            }
        }
    }

    removeCell(cell) {
        if (cell instanceof Cell) {
            if (this.coordInRange(cell.x, cell.y)) {
                //console.log(`x = ${cell.x} , y = ${cell.y} `)
                if (this.cellArray[cell.x][cell.y][1] === cell) {
                    this.cellArray[cell.x][cell.y][1] = "empty";
                    this.cellArray[cell.x][cell.y][0].fill('white');
                }
            }
        }
    }

    moveCell(cell, newX, newY) {
        if (cell instanceof Cell) {
            if (this.coordInRange(cell.x, cell.y)) {
                if (!(cell.x === newX && cell.y === newY)) {

                    if (this.cellArray[newX][newY][1] === "empty") {

                        this.cellArray[cell.x][cell.y][1] = "empty"
                        this.cellArray[cell.x][cell.y][0].fill('white');

                        this.cellArray[newX][newY][1] = cell;
                        this.cellArray[newX][newY][0].fill(cell.getType().color);
                        cell.move(newX, newY)

                    } else {

                        this.cellArray[cell.x][cell.y][1] = "empty"
                        this.cellArray[cell.x][cell.y][0].fill('white');
                        cell.remove()
                    }
                }
            }
        }
    }

    renderSVG() {
        for (let y = 0; y < this.cellHeight; y++) {
            for (let x = 0; x < this.cellWidth; x++) {
                if (this.cellArray[x][y][1] instanceof Cell) {
                    let lifeCell = this.cellArray[x][y][1];
                    this.giveEnergy(lifeCell);

                    this.serveSeeds(lifeCell);

                    this.cleanCell(x, y);
                }
            }
        }
    }

    serveSeeds(lifeCell) {

        if (lifeCell.getType() === CellType.Seed && !lifeCell.getTree().isAlive()) {
            if (lifeCell.y === 0 && !this.isCoordsHasCell(lifeCell.x, lifeCell.y + 1)) {
                if (Math.floor(Math.random() * 5) === 1) {
                    lifeCell.remove();
                } else if (!this.isCoordsHasCell(lifeCell.x + 1, lifeCell.y) &&
                    !this.isCoordsHasCell(lifeCell.x - 1, lifeCell.y)) {

                    this.cellArray[lifeCell.x][lifeCell.y][1] = "empty";
                    this.cellArray[lifeCell.x][lifeCell.y][0].fill('white');

                    let tree = new TreeFactory().createTreeFromSeed(lifeCell, this)
                    this.envDrive.addTree(tree);
                    lifeCell.x = -5
                    lifeCell.y = -5
                    lifeCell.remove();

                }
            } else if (!this.isCoordsHasCell(lifeCell.x, lifeCell.y - 1)) {
                this.moveCell(lifeCell, lifeCell.x, lifeCell.y - 1);
            } else {
                if (Math.floor(Math.random() * 5) === 1) {
                    lifeCell.remove();
                }
            }
        }
    }


    giveEnergy(cell) {
        if (cell.getType() === CellType.Usual) {
            let energyMass = cell.y;

            let clearEnergy = energyMass === 0 ? 0 : energyMass + 8;

            let winPercent = 3
            let count = 0
            for (let i = cell.y; i < this.cellHeight; i++) {
                if (winPercent === 0 && count === 3) {
                    break;
                }

                if (this.cellArray[cell.x][i][1] instanceof Cell) {
                    winPercent--;
                }
                count++;
            }
            //console.log(`x = ${cell.x} , y = ${cell.y}, energy = ${clearEnergy * winPercent} `)
            cell.giveEnergy(clearEnergy * winPercent);
            return clearEnergy * winPercent;
        }
    }

    cleanCell(x, y) {
        let cell = this.cellArray[x][y][1]
        if (cell instanceof Cell && !cell.getTree) {
            cell.remove()
        }
    }

    fixCoordX(x) {
        if (x > (this.cellWidth - 1)) {
            x = x - (this.cellWidth)
        } else if (x < 0) {
            x = (this.cellWidth) + x
        }
        return x;
    }

    coordInRange(x, y) {
        return ((y >= 0) && (y < this.cellArray[0].length));
    }

    isCoordsHasCell(x, y) {
        let xCord = this.fixCoordX(x)
        if (this.coordInRange(xCord, y)) {
            return this.cellArray[xCord][y][1] != "empty"
        } else {
            return true
        }
    }

}