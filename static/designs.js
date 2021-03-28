import { EnvDrive } from "./EnvDrive.js";
import { GridDrive } from "./GridDrive.js";

let canvas = document.getElementById("pixel_canvas");
let height = document.getElementById("input_height");
let width = document.getElementById("input_width");
let sizePicker = document.getElementById("sizePicker");
let color = document.getElementById("colorPicker");
let renderType = document.getElementById("renderType");
let stageContainer = document.getElementById("stage-container");

color.addEventListener("click", function () { });

sizePicker.onsubmit = function (event) {
    event.preventDefault();
    makeGrid();
};


function makeGrid() {
    /*let gridDrive = new GridDrive(canvas, height.value, width.value, color);
    gridDrive.initEmpty();

    let envDrive = new EnvDrive(gridDrive, renderType);

    gridDrive.envDrive = envDrive;

    envDrive.superRun();*/

    let width = 2000;
    let height = 300;
    stageContainer.setAttribute("style", `width: ${width}px`);
    stageContainer.setAttribute("style", `height: ${height}px`);

    const stage = acgraph.create('stage-container');

    let gridDrive = new GridDrive(stage, height, width, 10);
    gridDrive.initEmpty();
    console.log(gridDrive.cellArray)

    let envDrive = new EnvDrive(gridDrive, renderType);

    gridDrive.envDrive = envDrive;

    envDrive.superRun()
}

function fillWhite(gridDrive, height, width) {
    let x = Math.floor(Math.random() * width/10)
    let y = Math.floor(Math.random() * height/10)

    gridDrive.cellArray[x][y][0].fill("white");
}

