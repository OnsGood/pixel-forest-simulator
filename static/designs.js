import { EnvDrive } from "./EnvDrive.js";
import { GridDrive } from "./GridDrive.js";

let sizePicker = document.getElementById("sizePicker");
//let renderType = document.getElementById("renderType");
//let stageContainer = document.getElementById("stage-container");
let saveTrees = document.getElementById("saveTrees");
let rastrCanvas = document.getElementById("canv");

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

    let width = 5000;
    let height = 500;
    rastrCanvas.setAttribute("width", `${width}px`);
    rastrCanvas.setAttribute("height", `${height}px`);

    let context = rastrCanvas.getContext("2d");

    let gridDrive = new GridDrive(context, height, width, 10);

    gridDrive.initEmpty();

    envDrive = new EnvDrive(gridDrive, null);

    gridDrive.envDrive = envDrive;

    envDrive.superRun()

    //context.fillRect(1, 1, 15, 15);

}


