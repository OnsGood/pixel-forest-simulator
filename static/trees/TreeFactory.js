import { Cell } from "../cells/Cell.js";
import { CellType } from "../cells/CellType.js";
import { GeneFactory } from "../gene/geneFactory.js";
import { Tree } from "./Tree.js";

export class TreeFactory {
    geneFactory = new GeneFactory();

    startSimulation(girdDrive, maxX) {
        let treeArray = []
        for (let posX = 4; posX < maxX; posX = posX + 25) {
            treeArray.push(this.createTree(girdDrive.height-1, posX, girdDrive));
        }
        return treeArray
    }

    createTree(posX, posY, girdDrive) {
        let startCell = new Cell(posX, posY, CellType.Active, girdDrive, 0);

        let geneArray = this.geneFactory.createNewGeneArray(girdDrive);

        let tree = new Tree(startCell);
        tree.setGeneArray(geneArray);
        return tree;
    }

    createTreeFromSeed(seedCell, girdDrive) {
        let startCell = new Cell(seedCell.x, seedCell.y, CellType.Active, girdDrive, seedCell.startPoint);

        let geneArray = this.geneFactory.createGeneArrayFromOld(seedCell.geneArray);

        let tree = new Tree(startCell);
        tree.setGeneArray(geneArray);
        return tree;
    }

}