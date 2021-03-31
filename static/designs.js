import { CellViewer } from "./cellViewer.js";
import { EnvDrive } from "./drivers/EnvDrive.js";
import { GridDrive } from "./drivers/GridDrive.js";
import { SimConfig } from "./drivers/SimConfig.js";

let sizePicker = document.getElementById("sizePicker");
let rastrCanvas = document.getElementById("canv");
let startButton = document.getElementsByClassName("start_button")[0];

let envDrive;
let gridDrive;
window.simConfig = new SimConfig();

sizePicker.onsubmit = function (event) {
    event.preventDefault();
    makeGrid();
};

function makeGrid() {
    startButton.setAttribute("disabled", '')

    let width = 6000;
    let height = 600;
    rastrCanvas.setAttribute("width", `${width}px`);
    rastrCanvas.setAttribute("height", `${height}px`);

    let context = rastrCanvas.getContext("2d");

    gridDrive = new GridDrive(context, height, width, 10);

    gridDrive.initEmpty();

    envDrive = new EnvDrive(gridDrive);

    gridDrive.envDrive = envDrive;

    envDrive.superRun()

    let cellViewer = new CellViewer();

    cellViewer.init(gridDrive);
}