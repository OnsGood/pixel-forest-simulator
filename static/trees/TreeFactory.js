import { Cell } from "../cells/Cell.js";
import { CellType } from "../cells/CellType.js";
import { GeneFactory } from "../gene/geneFactory.js";
import { Tree } from "./Tree.js";

export class TreeFactory {
    geneFactory = new GeneFactory();

    startSimulation(gridDrive, maxX) {
        let treeArray = []
        for (let posX = 4; posX < maxX; posX = posX + 25) {
            treeArray.push(this.createTree(posX, 0, gridDrive, window.simConfig.startSeedEnergy));
        }
        return treeArray
    }

    createTree(posX, posY, gridDrive, energy) {
        let startCell = new Cell(posX, posY, CellType.Active, gridDrive, 0);

        let geneArray = this.geneFactory.createNewGeneArray();

        let tree = new Tree(startCell, this.geneFactory, energy, 1);
        tree.setGeneArray(geneArray);
        return tree;
    }

    createTreeFromSeed(seedCell, gridDrive) {
        let startCell = new Cell(seedCell.x, seedCell.y, CellType.Active, gridDrive, 0);

        let geneArray = this.geneFactory.createGeneArrayFromOld(seedCell.geneArray);

        let tree = new Tree(startCell, this.geneFactory, seedCell.energy, seedCell.generation + 1);
        tree.setGeneArray(geneArray);
        return tree;
    }

    createTreeFromGenes(posX, posY, gridDrive, energy, geneArray) {
        let startCell = new Cell(posX, posY, CellType.Active, gridDrive, 0);
        let tree = new Tree(startCell, this.geneFactory, energy, 0);
        tree.setGeneArray(geneArray);
        return tree;
    }

}