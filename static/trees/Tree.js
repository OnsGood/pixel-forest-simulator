import { CellType } from "../cells/CellType.js";

export class Tree {
    cells = [];
    maxGeneIterations = 50;
    energy = 20;
    life = 1;

    constructor(startCell) {
        this.addCell(startCell)
        this.alive = true
    }

    isAlive() {
        return this.alive;
    }

    setMaxGeneIterations(maxGeneIterations) {
        this.maxGeneIterations = maxGeneIterations
    }

    setGeneArray(geneArray) {
        this.geneArray = geneArray
    }

    addEnergy(count) {
        this.energy = this.energy + count;
    }

    getCells() {
        return this.cells
    }

    addCell(cell) {
        if (this.cells) {
            this.cells.push(cell);
            cell.setTree(this);
        }
    }

    growthCycle() {
        this.life = this.life * 1.05;
        this.energy = this.energy - this.life;
        if (this.isAlive()) {
            if (this.energy < 1 || Object.keys(this.cells).length > 200) {
                this.alive = false;
                this.killTree()
            } else {
                if (this.cells) {

                    this.cells.forEach((cell) => {

                        if (cell && cell.isAlive()) {
                            this.energy = this.energy - 5;
                            if (cell.getType() === CellType.Active) {

                                this.geneArray.run(cell, this.maxGeneIterations);

                                if (cell.getType() === CellType.Active) {
                                    cell.setType(CellType.Usual)
                                }
                            }
                        }
                    })
                }
            }
        }
    }

    killTree() {
        if (this.cells) {
            this.cells.forEach((cell) => {
                if (cell) {
                    if (cell.getType() === CellType.Usual) {
                        cell.remove();
                    } else {
                        if (Math.floor(Math.random() * 2) != 20) {
                            cell.setType(CellType.Seed);
                            cell.geneArray = this.geneArray;
                        } else {
                            cell.remove();
                        }
                    }
                }
            })
        }
        this.alive = false;
    }

    removeCell(cell) {
        if (this.cells) {
            this.cells = this.cells.map((elem) => {
                if (elem != cell) {
                    return elem;
                }
            })
            if (this.cells.length === 0) {
                this.killTree()
            }
        }

    }
}