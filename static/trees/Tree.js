import { CellType } from "../cells/CellType.js";

export class Tree {
    cells = [];
    energy = 300;
    life = 50;

    constructor(startCell, geneFactory) {
        this.id = Date.now();
        this.addCell(startCell)
        this.alive = true
        this.geneFactory = geneFactory
    }

    isAlive() {
        return this.alive;
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
        this.life--;
        
        if (this.isAlive()) {
            if (this.cells) {
                this.cells.forEach((cell) => {

                    if (cell && cell.isAlive()) {
                        this.energy = this.energy - 10;
                        if (cell.getType() === CellType.Active) {

                            this.geneFactory.runGene(cell, this.geneArray, cell.gridDrive)

                            if (cell.getType() === CellType.Active) {
                                cell.setType(CellType.Usual)
                            }
                        }
                    }
                })
            }

            if (this.energy < 1 || this.life == 0) {
                this.killTree()
            } 
        }
    }

    killTree() {
        this.alive = false;
        if (this.cells) {
            this.cells.forEach((cell) => {
                if (cell) {
                    if (cell.getType() === CellType.Usual) {
                        cell.remove();
                    } else {
                        if (Math.floor(Math.random() * 2) != 1) {
                            cell.setType(CellType.Seed);
                            cell.geneArray = this.geneArray;
                        } else {
                            cell.remove();
                        }
                    }
                }
            })
        }
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

    cleanCells() {
        this.cells = this.cells.filter((cell) => {
            if (cell) {
                if (cell.isAlive()) {
                    return true;
                }
            }
            return false;
        });
    }
}