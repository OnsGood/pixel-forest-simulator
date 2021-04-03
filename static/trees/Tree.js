import { CellType } from "../cells/CellType.js";

export class Tree {
    // массив с клетками дерева
    cells = [];
    energy;

    // жизнь - расходуется за каждый ход, добывается исполнением гена
    life = window.simConfig.startTreeLife;

    // ограничение максимального числа клеток
    maxCells = window.simConfig.maxCells;

    constructor(startCell, geneFactory, energy, generation) {
        //this.id = Date.now();
        this.addCell(startCell)

        // показатель жизни
        this.alive = true

        // фабрика генов
        this.geneFactory = geneFactory

        //энергия дерева. Расходуется с клеток, майнится зелеными клетками из среды
        this.energy = energy;

        //поколение дерева
        this.generation = generation;
    }

    isAlive() {
        return this.alive;
    }

    setGeneArray(geneArray) {
        this.geneArray = geneArray
    }

    addLife(count) {
        if (this.life < simConfig.treeMaxLife) {
            this.life = this.life + count;
        }
    }

    addEnergy(count) {
        if (this.energy < simConfig.treeMaxEnergy) {
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

    // дерево теряет энергию и жизнь, исполняет гены. запускать для каждого в шаг симуляции
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

            if (this.energy < 1 || this.life < 1 || this.cells.length > this.maxCells) {
                this.killTree()
            }
        }
    }

    killTree() {
        if (this.alive) {
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
                            if (!cell.released) {
                                this.releaseCell(cell);
                                cell.energy = ((this.energy + 1) / seedCount) + window.simConfig.startSeedEnergySum;
                            }
                        }

                    }
                })
            }
        }
    }

    releaseCell(cell) {
        cell.setType(CellType.Seed);
        cell.geneArray = this.geneArray;
        cell.generation = this.generation;
        cell.released = true;
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