'use strict'

export class Cell {
    x = 0;
    y = 0;
    type = ''
    tree = ''

    constructor(x, y, type, girdDrive, startPoint) {
        this.x = x
        this.y = y
        this.type = type
        this.girdDrive = girdDrive
        this.startPoint = startPoint

        this.girdDrive.addCell(this)
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
            let oldX = this.x
            let oldY = this.y

            this.x = newX
            this.y = newY

            this.girdDrive.moveCell(this, oldX, oldY)
        }
    }

    remove() {
        this.girdDrive.removeCell(this)
        this.tree.removeCell(this)
        this.alive = false
        this.type = null
        this.tree = null
        this.girdDrive = null
    }


}
