import { TreeFactory } from "./trees/TreeFactory.js";

export class EnvDrive {
    treeArray = []

    constructor(gridDrive, renderType) {
        this.gridDrive = gridDrive;
        this.renderVariant = true;
        renderType.addEventListener('change', () => this.renderVariant = !this.renderVariant);
    }

    addTree(tree) {
        this.treeArray.push(tree)
    }

    run() {
        if (Object.keys(this.treeArray).length === 0) {
            this.treeArray = new TreeFactory().startSimulation(this.gridDrive, this.gridDrive.width - 1);
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

        if (this.renderVariant) {
            this.gridDrive.renderInTable();
        } else {
            this.gridDrive.renderMock();
        }

        let millisRender = Date.now();

        console.log("grow time - " + (millisCycle2 - millisCycle1))
        console.log("render time - " + (millisRender - millisCycle2))
        console.log("renderType = " + this.renderVariant)

        setTimeout(() => this.run(), 5)
    }

    superRun() {
        setInterval(() => this.clear(), 3000);
        this.run();
    }

    clear() {
        console.log("Clean!")
        this.treeArray = this.treeArray.filter((tree) => {
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
        console.log("trees - " + Object.keys(this.treeArray).length)

    }

}