import { Cell } from "../cells/Cell.js";
import { CellType } from "../cells/CellType.js";


export class GeneFactory {
    countOfGenes = 10;
    maxValueInGene = 50;
    mutationChance = 10;

    BEH_LEFT = 0
    BEH_UP = 1
    BEH_DOWN = 2
    BEH_RIGHT = 3
    // gene sctructure:
    //    1
    //  0   3   
    //    2
    // 0 to (countOfGenes-1) = generational genes
    // countOfGenes = make cell seed 
    // count of genes + 1 = make cell usual

    runGene(cell, geneArray, gridDrive) {
        let gene = geneArray[cell.startPoint]

        for (let i = 0; i < 4; i++) {
            let behavior = gene[i]
            if (behavior >= 0 && behavior < this.countOfGenes) {
                this.createCell(i, behavior, cell, gridDrive);
            } else if (behavior === this.countOfGenes) {
                this.changeCellType(cell, CellType.Seed)
            } else if (behavior === (this.countOfGenes + 1)) {
                this.changeCellType(cell, CellType.Usual)
            }
        }
    }

    createNewGeneArray() {
        let geneArray = []
        for (let i = 0; i < this.countOfGenes; i++) {
            geneArray.push([
                this.getRandomGeneBehavior(),
                this.getRandomGeneBehavior(),
                this.getRandomGeneBehavior(),
                this.getRandomGeneBehavior()
            ]);
        }
        return geneArray;
    }

    createGeneArrayFromOld(geneArray) {
        let newGeneArray = []
        geneArray.forEach(gene => {
            newGeneArray.push([gene[0], gene[1], gene[2], gene[3]])
        });
        newGeneArray = this.mutateGeneArray(newGeneArray)
        return newGeneArray
    }

    mutateGeneArray(geneArray) {
        if (Math.floor(Math.random() * 100) < this.mutationChance) {
            let mutatGene = Math.floor(Math.random() * (this.countOfGenes - 1))
            let gene = geneArray[mutatGene];

            let mutatGenePart = Math.floor(Math.random() * 4)

            gene[mutatGenePart] = this.getRandomGeneBehavior()
        }
        return geneArray;
    }

    getRandomGeneBehavior() {
        return Math.floor(Math.random() * this.maxValueInGene);
    }




    changeCellType(cell, type) {
        cell.setType(type);
    }

    createCell(BEH, startPoint, cell, gridDrive) {
        let x = null
        let y = null
        switch (BEH) {
            case this.BEH_LEFT:
                x = 0
                y = -1
                break;
            case this.BEH_UP:
                x = -1
                y = 0
                break;
            case this.BEH_DOWN:
                x = 1
                y = 0
                break;
            case this.BEH_RIGHT:
                x = 0
                y = 1
                break;
        }

        let newCell = new Cell(cell.x + x, cell.y + y, CellType.Active, gridDrive, startPoint);
        cell.getTree().addCell(newCell);
        return newCell;
    }
}




let Behaviors = {
    createNewCellUp(cell, data, gridDrive) {
        let cordX = cell.x
        let cordY = cell.y + 1

        if (!gridDrive.isCoordsHasCell(cordX, cordY)) {
            let newCell = new Cell(cordX, cordY, CellType.Active, gridDrive, data[1]);
            cell.getTree().addCell(newCell);
        }
        return data[0]
    },
    createNewCellLeft(cell, data, gridDrive) {
        let cordX = cell.x - 1
        let cordY = cell.y

        if (!gridDrive.isCoordsHasCell(cordX, cordY)) {
            let newCell = new Cell(cordX, cordY, CellType.Active, gridDrive, data[1]);
            cell.getTree().addCell(newCell);
        }
        return data[0]
    },
    createNewCellRight(cell, data, gridDrive) {
        let cordX = cell.x + 1
        let cordY = cell.y

        if (!gridDrive.isCoordsHasCell(cordX, cordY)) {
            let newCell = new Cell(cordX, cordY, CellType.Active, gridDrive, data[1]);
            cell.getTree().addCell(newCell);
        }
        return data[0]
    },
    createNewCellDown(cell, data, gridDrive) {
        let cordX = cell.x
        let cordY = cell.y - 1

        if (!gridDrive.isCoordsHasCell(cordX, cordY)) {
            let newCell = new Cell(cordX, cordY, CellType.Active, gridDrive, data[1]);
            cell.getTree().addCell(newCell);
        }
        return data[0]
    },

    getEnergy(cell, data, gridDrive) {
        return data[0]
    },

    getSize(cell, data, gridDrive) {
        let size = 1;
        if (cell.getTree() && cell.getTree().getCells()) {
            size = cell.getTree().getCells().lenght;
        }
        if (size >= data[2]) {
            return data[0]
        } else {
            return data[1]
        }
    },
    getHeight(cell, data, gridDrive) {
        let height = cell.x;
        if (height >= data[2]) {
            return data[0]
        } else {
            return data[1]
        }
    },
    changeCellTypeToSeed(cell, data, gridDrive) {
        cell.setType(CellType.Seed)
        return data[0]
    },
    changeCellTypeToUsual(cell, data, gridDrive) {
        cell.setType(CellType.Usual)
        return data[0]
    },
    killTree(cell, data, gridDrive) {
        if (cell.getTree()) {
            cell.getTree().killTree()
        }
        return data[0]
    },
    killCell(cell, data, gridDrive) {
        //cell.remove()
        return data[0]
    },
}