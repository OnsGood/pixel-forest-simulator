'use strict'

export class Cell {
    x = 0;
    y = 0;
    type = ''
    tree = ''

    constructor(x, y, type, gridDrive, startPoint) {
        this.alive = true
        this.x = x
        this.y = y
        this.type = type
        this.gridDrive = gridDrive
        this.startPoint = startPoint
        this.gridDrive.addCell(this)
        this.energy = 0;
    }

    isAlive() {
        return this.alive;
    }

    giveEnergy(count) {
        this.energy = count;
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
        if (this.alive) {
            this.type = type
            this.gridDrive.changeCellColor(this);
        }
    }

    move(newX, newY) {
        if (this.alive) {
            this.x = newX
            this.y = newY
        }
    }

    remove() {
        this.alive = false
        this.gridDrive.removeCell(this)
        if (this.tree) {
            this.tree.removeCell(this)
        }
        this.type = null
        this.tree = null
    }


}
