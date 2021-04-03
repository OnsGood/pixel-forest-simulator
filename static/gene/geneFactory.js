import { Cell } from "../cells/Cell.js";
import { CellType } from "../cells/CellType.js";


export class GeneFactory {
    countOfGenes = 20;
    maxValueInGene = 50;
    mutationChance = 25;

    maxDopDataInGene = 500;
    dopDataPos = 4;

    maxDopBehInGene = 4;
    dopBehPos = 5;

    BEH_LEFT = 0
    BEH_UP = 1
    BEH_DOWN = 2
    BEH_RIGHT = 3
    // gene sctructure:
    //    1
    //  0   3    (4)-dop data  (5)-dop behavior
    //    2
    // значения числа в гене -
    // 0 to (CG-1)          = generational genes, создает клетку, с стартовой точкой = CG
    // CG                   = make cell seed 
    // CG + 1               = make cell usual
    // CG + 2               = +- x life to tree
    // CG + 3               = kill cell
    // CG + 3               = release seed

    runGene(cell, geneArray, gridDrive) {
        let gene = geneArray[cell.startPoint]

        for (let i = 0; i < 4; i++) {
            let behavior = gene[i]
            let dopData = gene[this.dopDataPos]
            let dopBeh = gene[this.dopBehPos]

            if (behavior >= 0 && behavior < this.countOfGenes) {
                this.chooseBeh(dopBeh, dopData, cell, this.createCell.bind(this), i, behavior, cell, gridDrive)
            } else if (behavior === this.countOfGenes) {
                this.chooseBeh(dopBeh, dopData, cell, this.changeCellType.bind(this), cell, CellType.Seed)
            } else if (behavior === (this.countOfGenes + 1)) {
                this.chooseBeh(dopBeh, dopData, cell, this.changeCellType.bind(this), cell, CellType.Usual)
            } else if (behavior === (this.countOfGenes + 2)) {
                this.chooseBeh(dopBeh, dopData, cell, this.addLifeToTree.bind(this), cell.getTree(), gene[4])
            } else if (behavior === (this.countOfGenes + 3)) {
                this.chooseBeh(dopBeh, dopData, cell, this.killCell.bind(this), cell)
                break;
            } else if (behavior === (this.countOfGenes + 4)) {
                this.chooseBeh(dopBeh, dopData, cell, this.releaseSeed.bind(this), cell, gene[4])
                break;
            }
        }
    }

    createNewGeneArray() {
        let geneArray = []
        for (let i = 0; i < this.countOfGenes; i++) {
            geneArray.push([
                this.getRandomGeneBehavior(0),
                this.getRandomGeneBehavior(1),
                this.getRandomGeneBehavior(2),
                this.getRandomGeneBehavior(3),
                this.getRandomGeneBehavior(4),
                this.getRandomGeneBehavior(5)
            ]);
        }
        return geneArray;
    }

    createGeneArrayFromOld(geneArray) {
        let newGeneArray = []
        geneArray.forEach(gene => {
            newGeneArray.push([gene[0], gene[1], gene[2], gene[3], gene[4], gene[5]])
        });
        newGeneArray = this.mutateGeneArray(newGeneArray)
        //console.log(newGeneArray)
        return newGeneArray
    }

    mutateGeneArray(geneArray) {
        if (Math.floor(Math.random() * 100) < this.mutationChance) {
            let mutatGene = Math.floor(Math.random() * (this.countOfGenes - 1))
            let gene = geneArray[mutatGene];

            let mutatGenePart = Math.floor(Math.random() * 6)

            gene[mutatGenePart] = this.getRandomGeneBehavior(mutatGenePart)
        }
        return geneArray;
    }

    getRandomGeneBehavior(numberOfGene) {
        if (numberOfGene === this.dopDataPos) {
            let max = this.maxDopDataInGene / 2;
            let min = -1 * max;
            return Math.floor(Math.random() * (max - min) + min);
        } else if (numberOfGene === this.dopBehPos) {
            return Math.floor(Math.random() * this.maxDopBehInGene);
        } else {
            return Math.floor(Math.random() * this.maxValueInGene);
        }
    }


    chooseBeh(dopBeh, dopData, cell, callback, ...args) {
        switch (dopBeh) {
            case 0:
                callback(...args);
                break;
            case 1:
                if (cell.tree.cells.length > dopData)
                    callback(...args);
                break;
            case 2:
                if (cell.tree.life > dopData)
                    callback(...args);
                break;
            case 3:
                if (cell.y > dopData)
                    callback(...args);
                break;
        }
    }



    addLifeToTree(tree, value) {
        //console.log(value)
        if (value > 15)
            value = 15
        else if (value < -15)
            value = -15
        tree.addLife(value);
    }

    changeCellType(cell, type) {
        cell.setType(type);
    }

    killCell(cell) {
        cell.remove();
    }

    releaseSeed(cell, energy) {
        if (energy > 0) {
            cell.getTree().addEnergy(-1 * energy)
            if (cell.getTree().energy > 0) {
                cell.getTree().releaseCell(cell);
                cell.energy = energy
            }
        }
    }

    createCell(BEH, startPoint, cell, gridDrive) {
        let x = null
        let y = null
        switch (BEH) {
            case this.BEH_LEFT:
                x = -1
                y = 0
                break;
            case this.BEH_UP:
                x = 0
                y = 1
                break;
            case this.BEH_DOWN:
                x = 0
                y = -1
                break;
            case this.BEH_RIGHT:
                x = 1
                y = 0
                break;
        }

        let newCell = new Cell(cell.x + x, cell.y + y, CellType.Active, gridDrive, startPoint);
        cell.getTree().addCell(newCell);
        return newCell;
    }
}

