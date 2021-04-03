'use strict'

export const CellType =
{
    Active: { color: "RGB(143,45,45)", name: "Active", energyConsuming: 10 },
    Seed: { color: "RGB(45,57,143)", name: "Seed", energyConsuming: 15 },
    Usual: { color: "RGB(16,141,55)", name: "Usual", energyConsuming: 10 },
    Structural: { color: "RGB(141, 16, 124)", name: "Usual", energyConsuming: 2 }
}

export let Seedeable = (cell) => {
    return (cell.getType() == CellType.Active) || (cell.getType() == CellType.Seed)
}