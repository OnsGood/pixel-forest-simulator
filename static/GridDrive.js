import { Cell } from "./cells/Cell.js";
import { CellType } from "./cells/CellType.js";
import { TreeFactory } from "./trees/TreeFactory.js";


export class GirdDrive {
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
            if (this.cellArray[cell.x][cell.y] === "empty") {
                this.cellArray[cell.x][cell.y] = cell;
            }
        }
    }

    removeCell(cell) {
        if (cell instanceof Cell) {
            if (this.cellArray[cell.x][cell.y] === cell) {
                this.cellArray[cell.x][cell.y] = "empty";
            }
        }
    }

    removeCoords(cell, x, y) {
        if (cell instanceof Cell) {
            if (this.cellArray[x][y] === cell) {
                this.cellArray[x][y] = "empty";
            }
        }
    }

    moveCell(cell, oldX, oldY) {
        if (cell instanceof Cell) {
            if (this.coordInRange(cell.x, cell.y)) {
                if (!(cell.x === oldX && cell.y === oldY)) {
                    if (this.cellArray[cell.x][cell.y] === "empty") {

                        this.cellArray[oldX][oldY] = "empty"
                        this.cellArray[cell.x][cell.y] = cell;

                    } else {
                        this.cellArray[oldX][oldY] = "empty"
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

                    this.giveEnergy(lifeCell);

                    switch (lifeCell.getType()) {
                        case CellType.Seed:
                            cell.setAttribute("style", `background-color: RGB(45,57,143)`);
                            break;
                        case CellType.Usual:
                            cell.setAttribute("style", `background-color: RGB(27,80,29)`);
                            break;
                        case CellType.Active:
                            cell.setAttribute("style", `background-color: RGB(143,45,45)`);
                            break;
                    }

                    if (lifeCell.getType() === CellType.Seed && !lifeCell.getTree().isAlive()) {
                        if (lifeCell.x === this.height - 1 && !this.isCoordsHasCell(lifeCell.x - 1, lifeCell.y)) {
                            let tree = new TreeFactory().createTreeFromSeed(lifeCell, this)
                            this.envDrive.addTree(tree);
                            lifeCell.remove();
                        }
                        if (this.coordInRange(lifeCell.x + 1, lifeCell.y)) {
                            lifeCell.move(lifeCell.x + 1, lifeCell.y);
                        }
                    }


                }
            }
        }
    }

    renderMock() {
        for (let r = 0; r < this.height; r++) {
            for (let c = 0; c < this.width; c++) {
                if (this.cellArray[r][c] instanceof Cell) {
                    let lifeCell = this.cellArray[r][c]

                    this.giveEnergy(lifeCell);

                    if (lifeCell.getType() === CellType.Seed && !lifeCell.getTree().isAlive()) {
                        if (lifeCell.x === this.height - 1 && !this.isCoordsHasCell(lifeCell.x - 1, lifeCell.y)) {
                            let tree = new TreeFactory().createTreeFromSeed(lifeCell, this)
                            this.envDrive.addTree(tree);
                            lifeCell.remove();
                        }
                        if (this.coordInRange(lifeCell.x + 1, lifeCell.y)) {
                            lifeCell.move(lifeCell.x + 1, lifeCell.y);
                        }
                    }


                }
            }
        }
    }


    giveEnergy(cell) {
        if (cell.getType() === CellType.Usual) {
            let energyMass = (this.height - 1) - cell.x;
            let clearEnergy = 0;

            if (energyMass < 2) {
                clearEnergy = 0;
            } else if (energyMass < 10) {
                clearEnergy = energyMass + 5
            } else if (energyMass < 50) {
                clearEnergy = 30;
            }
            let winPercent = 1

            for (let i = cell.x - 1; i >= 0; i--) {
                if (this.cellArray[i][cell.y] instanceof Cell) {
                    winPercent = winPercent - 0.3
                }
            }

            if (winPercent > 0) {
                cell.giveEnergy(clearEnergy * winPercent);
            }
        }
    }

    clearGrid() {
        while (this.canvas.firstChild) {
            this.canvas.removeChild(this.canvas.firstChild);
        }
    }

    clearDead(cell, x, y) {
        if (!cell.isAlive()) {
            this.removeCoords(cell, x, y);
        } else {
            if (cell.getType != CellType.Seed && !cell.getTree()) {
                this.removeCoords(cell, x, y);
            }
        }
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