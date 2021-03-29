import { EnvDrive } from "./EnvDrive.js";
import { GridDrive } from "./GridDrive.js";

let sizePicker = document.getElementById("sizePicker");
let renderType = document.getElementById("renderType");
let stageContainer = document.getElementById("stage-container");
let saveTrees = document.getElementById("saveTrees");

let envDrive;

sizePicker.onsubmit = function (event) {
    event.preventDefault();
    makeGrid();
};


saveTrees.onclick = function saveTreesReaction() {
    envDrive.treeArray.forEach((tree) => {
        console.log(tree.serialize());
    })
}

function makeGrid() {

    let width = 3000;
    let height = 300;
    stageContainer.setAttribute("style", `width: ${width}px`);
    stageContainer.setAttribute("style", `height: ${height}px`);

    const stage = acgraph.create('stage-container');

    let gridDrive = new GridDrive(stage, height, width, 10);
    gridDrive.initEmpty();
    console.log(gridDrive.cellArray)

    envDrive = new EnvDrive(gridDrive, renderType);

    gridDrive.envDrive = envDrive;

    envDrive.superRun()
}


