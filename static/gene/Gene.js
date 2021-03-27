import { Cell } from "../cells/Cell.js";
import { CellType } from "../cells/CellType.js";

export class Gene {
    constructor(behavior, data, girdDrive) {
        this.behavior = behavior;
        this.data = data;
        this.girdDrive = girdDrive;
    }

    setDataElem(elemNum, value) {
        this.data[elemNum] = value
    }

    run(cell) {
        return this.behavior(cell, this.data, this.girdDrive);
    }

    setBehavior(behavior) {
        this.behavior = behavior;
    }

    setData(data) {
        this.data = data;
    }

    getBehavior() {
        return this.behavior;
    }

    getData() {
        return this.data;
    }
}

export let Behaviors = {
    createNewCellUp(cell, data, girdDrive) {
        let cordX = cell.x
        let cordY = cell.y + 1

        if (!girdDrive.isCoordsHasCell(cordX, cordY)) {
            let newCell = new Cell(cordX, cordY, CellType.Active, girdDrive, data[1]);
            cell.getTree().addCell(newCell);
        }
        return data[0]
    },
    createNewCellLeft(cell, data, girdDrive) {
        let cordX = cell.x - 1
        let cordY = cell.y

        if (!girdDrive.isCoordsHasCell(cordX, cordY)) {
            let newCell = new Cell(cordX, cordY, CellType.Active, girdDrive, data[1]);
            cell.getTree().addCell(newCell);
        }
        return data[0]
    },
    createNewCellRight(cell, data, girdDrive) {
        let cordX = cell.x + 1
        let cordY = cell.y

        if (!girdDrive.isCoordsHasCell(cordX, cordY)) {
            let newCell = new Cell(cordX, cordY, CellType.Active, girdDrive, data[1]);
            cell.getTree().addCell(newCell);
        }
        return data[0]
    },
    createNewCellDown(cell, data, girdDrive) {
        let cordX = cell.x
        let cordY = cell.y - 1

        if (!girdDrive.isCoordsHasCell(cordX, cordY)) {
            let newCell = new Cell(cordX, cordY, CellType.Active, girdDrive, data[1]);
            cell.getTree().addCell(newCell);
        }
        return data[0]
    },

    getEnergy(cell, data, girdDrive) {
        return data[0]
    },

    getSize(cell, data, girdDrive) {
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
    getHeight(cell, data, girdDrive) {
        let height = cell.x;
        if (height >= data[2]) {
            return data[0]
        } else {
            return data[1]
        }
    },
    changeCellTypeToSeed(cell, data, girdDrive) {
        cell.setType(CellType.Seed)
        return data[0]
    },
    changeCellTypeToUsual(cell, data, girdDrive) {
        cell.setType(CellType.Usual)
        return data[0]
    },
    killTree(cell, data, girdDrive) {
        if (cell.getTree()) {
            cell.getTree().killTree()
        }
        return data[0]
    },
    killCell(cell, data, girdDrive) {
        //cell.remove()
        return data[0]
    },
}