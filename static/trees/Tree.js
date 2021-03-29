import { CellType } from "../cells/CellType.js";

export class Tree {
    cells = [];
    energy;
    life = 50;

    constructor(startCell, geneFactory, energy) {
        this.id = Date.now();
        this.addCell(startCell)
        this.alive = true
        this.geneFactory = geneFactory
        this.energy = energy;
    }

    isAlive() {
        return this.alive;
    }

    setGeneArray(geneArray) {
        this.geneArray = geneArray
    }

    addEnergy(count) {
        if (this.energy < 50000) {
            this.energy = this.energy + count;
        }
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

            if (this.energy < 1 || this.life < 1) {
                this.killTree()
            }
        }
    }

    killTree() {
        this.alive = false;
        let seedCount = 0;
        if (this.cells) {
            this.cells.forEach((cell) => {
                if (cell && cell.isAlive()) {
                    if (cell.getType() != CellType.Usual) {
                        seedCount++;
                    }
                }
            })

            this.cells.forEach((cell) => {
                if (cell && cell.isAlive()) {

                    if (cell.getType() === CellType.Usual) {
                        cell.remove();
                    } else {
                        cell.setType(CellType.Seed);
                        cell.geneArray = this.geneArray;
                        cell.energy = ((this.energy + 1) / seedCount) + 100
                    }

                }
            })
        }
    }

    removeCell(cell) {
        if (this.cells) {
            this.cells = this.cells.filter((elem) => {
                if (elem != cell) {
                    return true;
                }
                return false;
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

    serialize() {
        if (this.isAlive()) {
            let data = {};
            data.gene = this.geneArray;
            data.life = this.life;
            data.energy = this.energy;
            data.countOfCells = this.cells.length;
            return JSON.stringify(data, null, 2)
        }
        return null;
    }
}