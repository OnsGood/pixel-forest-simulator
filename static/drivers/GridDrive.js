import { Cell } from "../cells/Cell.js";
import { CellType } from "../cells/CellType.js";
import { TreeFactory } from "../trees/TreeFactory.js";


export class GridDrive {
    cellArray = [];       

    constructor(drawingPlate, height, width, cellSize) {
        this.drawingPlate = drawingPlate;
        this.height = height;
        this.width = width;

        this.cellHeight = height / cellSize;
        this.cellWidth = width / cellSize;

        this.cellSize = cellSize;
    }

    initEmpty() {
        this.cellArray = []
        this.drawingPlate.fillStyle = window.simConfig.backColor
        for (let y = this.height - this.cellSize; y >= 0; y = (y - this.cellSize)) {
            let yst = []
            for (let x = 0; x < this.width; x = (x + this.cellSize)) {
                let rect = {};
                rect.x = x
                rect.y = y

                this.drawingPlate.fillRect(x, y, this.cellSize, this.cellSize);

                yst.push([rect, "empty"]);
            }
            this.cellArray.push(yst)
        }
        this.cellArray = this.cellArray[0].map((_, colIndex) => this.cellArray.map(row => row[colIndex]));
    }

    drawCell(rect, cellStyle) {
        this.drawingPlate.fillStyle = cellStyle;
        this.drawingPlate.fillRect(rect.x, rect.y, this.cellSize, this.cellSize);
    }

    changeCellColor(cell) {
        if (cell && cell.isAlive() && this.cellArray[cell.x][cell.y]) {
            this.drawCell(this.cellArray[cell.x][cell.y][0], cell.getType().color);
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
                this.drawCell(this.cellArray[xCord][yCord][0], cell.getType().color)
                this.cellArray[xCord][yCord][0]
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
                    this.drawCell(this.cellArray[cell.x][cell.y][0], window.simConfig.backColor);
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
                        this.drawCell(this.cellArray[cell.x][cell.y][0], window.simConfig.backColor);

                        this.cellArray[newX][newY][1] = cell;
                        this.drawCell(this.cellArray[newX][newY][0], cell.getType().color);
                        cell.move(newX, newY)

                    } else {

                        this.cellArray[cell.x][cell.y][1] = "empty"
                        this.drawCell(this.cellArray[cell.x][cell.y][0], window.simConfig.backColor);
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
            if (lifeCell.y === 0) {
                if (Math.floor(Math.random() * 5) === 1) {
                    lifeCell.remove();
                } else if (
                    !this.isCoordsHasCell(lifeCell.x + 1, lifeCell.y) &&
                    !this.isCoordsHasCell(lifeCell.x - 1, lifeCell.y) &&
                    !this.isCoordsHasCell(lifeCell.x, lifeCell.y + 1) &&
                    !this.isCoordsHasCell(lifeCell.x, lifeCell.y + 2)
                ) {

                    this.cellArray[lifeCell.x][lifeCell.y][1] = "empty";
                    this.drawCell(this.cellArray[lifeCell.x][lifeCell.y][0], window.simConfig.backColor);

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

            let clearEnergy = energyMass === 0 ? 0 : energyMass + window.simConfig.energyMassSum;

            let count = 0
            let winPercent = window.simConfig.winPercent
            for (let i = cell.y + 1; i < this.cellHeight; i++) {
                if (winPercent === 0 || count === window.simConfig.maxHeighSteps) {
                    break;
                }

                if (this.cellArray[cell.x][i][1] instanceof Cell) {
                    winPercent--;
                }
                count++;
            }

            clearEnergy = clearEnergy * winPercent;

            clearEnergy = clearEnergy > window.simConfig.maxEnergy ? window.simConfig.maxEnergy : clearEnergy;

            cell.giveEnergy(clearEnergy);
            return clearEnergy;
        }
    }

    cleanCell(x, y) {
        let cell = this.cellArray[x][y][1]
        if (cell instanceof Cell && !cell.getTree) {
            cell.remove()
        }
    }


    getCellOnCanvas(clientX, clientY) {
        clientY = this.height - clientY;

        let cordX = ((clientX - (clientX % this.cellSize)) / this.cellSize);
        let cordY = ((clientY - (clientY % this.cellSize)) / this.cellSize);
        //alert(`cordX = ${cordX}, cordY = ${cordY}, cellType = ${this.cellArray[cordX][cordY][1].type.color}`);

        return this.cellArray[cordX][cordY][1];
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