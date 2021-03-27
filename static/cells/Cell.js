'use strict'

export class Cell {
    x = 0;
    y = 0;
    type = ''
    tree = ''

    constructor(x, y, type, gridDrive, startPoint) {
        let height = document.getElementById("input_height");
        this.x = x
        this.y = y

        /*if (y > (height.value - 1)) {
            this.y = (height.value - 1) - y
        } else if (y < 0) {
            this.y = (height.value - 1) + y
        } else {
            
        }*/
        this.type = type
        this.gridDrive = gridDrive
        this.startPoint = startPoint

        this.gridDrive.addCell(this)
        this.alive = true
    }

    isAlive() {
        return this.alive;
    }

    giveEnergy(count) {
        if (this.tree) {
            this.tree.addEnergy(count);
        }
    }

    getType() {
        return this.type;
    }

    getTree() {
        return this.tree
    }

    setTree(tree) {
        this.tree = tree
    }

    setType(type) {
        this.type = type
    }

    move(newX, newY) {
        if (this.alive) {
            this.x = newX
            this.y = newY
        }
    }

    remove() {
        this.gridDrive.removeCell(this)
        if (this.tree) {
            this.tree.removeCell(this)
        }
        this.alive = false
        this.type = null
        this.tree = null
        this.gridDrive = null
    }


}
