import { TreeFactory } from "../trees/TreeFactory.js";

export class EnvDrive {
    treeArray = []
    colorSeed = ""
    colorUsual = ""
    colorActive = ""

    constructor(gridDrive) {
        this.gridDrive = gridDrive;
    }

    addTree(tree) {
        this.treeArray.push(tree)
    }

    run() {
        if (Object.keys(this.treeArray).length === 0) {
            this.treeArray = new TreeFactory().startSimulation(this.gridDrive, this.gridDrive.cellWidth - 1);
        }

        let millisCycle1 = Date.now();

        for (let num in this.treeArray) {
            let tree = this.treeArray[num]
            if (tree) {
                if (tree.isAlive()) {
                    tree.growthCycle();
                }
            }
        }
        let millisCycle2 = Date.now();

        this.gridDrive.renderSVG();

        let millisRender = Date.now();

        /*console.log("grow time - " + (millisCycle2 - millisCycle1))
        console.log("render time - " + (millisRender - millisCycle2))*/

        setTimeout(() => this.run(), window.simConfig.delay)
    }

    superRun() {
        setInterval(() => this.treeArray = this.clear(this.treeArray), 3000);
        this.run();
    }

    viewTreeRun(cellData, xPos, energy, delay) {
        let factory = new TreeFactory()
        let gridDrive = this.gridDrive
        let treeArray = this.treeArray
        treeArray = []
        gridDrive.initEmpty();

        let vievRunner = {
            run: true,
            go: (clear, vievRunner) => {
                
                if (treeArray.length > 0) {
                    for (let num in treeArray) {
                        let tree = treeArray[num]
                        if (tree) {
                            if (tree.isAlive()) {
                                tree.growthCycle();
                            }
                        }
                    }
                    gridDrive.renderSVG()
                    clear(treeArray)
                } else {
                    treeArray[0] = factory.createTreeFromGenes(xPos, 0, gridDrive, energy, cellData.geneArray)
                }

                if (vievRunner.run) {
                    setTimeout(() => vievRunner.go(clear, vievRunner), delay);
                } else {
                    treeArray.forEach((tree) => {
                        if (tree) {
                            if (tree) {
                                tree.alive = false
                                tree.cells.forEach((cell) => {
                                    if (cell) {
                                        cell.remove()
                                    }
                                })
                            }
                        }
                    })
                }
            }
        };


        vievRunner.go(this.clear, vievRunner);
        return vievRunner;
    }


    clear(treeArray) {
        //console.log("Clean!")
        treeArray = treeArray.filter((tree) => {
            if (tree) {
                if (tree.isAlive()) {
                    if (tree.cells != undefined) {
                        if (Object.keys(tree.cells).length > 0) {
                            tree.cleanCells();
                            return true;
                        } else {
                            tree.killTree();
                        }
                    } else {
                        tree.killTree();
                    }
                } else {
                    tree.killTree();
                }
            }
            return false;
        });
        //console.log("trees - " + Object.keys(treeArray).length)
        return treeArray;
    }
}