import { EnvDrive } from "./EnvDrive.js";
import { GridDrive } from "./GridDrive.js";

let canvas = document.getElementById("pixel_canvas");
let height = document.getElementById("input_height");
let width = document.getElementById("input_width");
let sizePicker = document.getElementById("sizePicker");
let color = document.getElementById("colorPicker");
let renderType = document.getElementById("renderType");

color.addEventListener("click", function () { });

sizePicker.onsubmit = function (event) {
    event.preventDefault();
    makeGrid();
};


function makeGrid() {
    let gridDrive = new GridDrive(canvas, height.value, width.value, color);
    gridDrive.initEmpty();

    let envDrive = new EnvDrive(gridDrive, renderType);

    gridDrive.envDrive = envDrive;

    envDrive.superRun();

}

