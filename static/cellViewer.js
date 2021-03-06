import { Cell } from "./cells/Cell.js";
import { EnvDrive } from "./drivers/EnvDrive.js";
import { GridDrive } from "./drivers/GridDrive.js";

let modal = document.getElementById("my_modal");
let closeElement = document.getElementsByClassName("close_modal_window")[0];

let cellType = document.getElementById("cell_type");
let treeEnegy = document.getElementById("tree_energy");
let treeLife = document.getElementById("tree_life");
let treeCellCount = document.getElementById("tree_cell_count");
let posX = document.getElementById("posX");
let posY = document.getElementById("posY");
let cellEnergy = document.getElementById("cellEnergy");
let generation = document.getElementById("generation");


let modalCanvas = document.getElementById("modal_canv");
let canvasContainer = document.getElementsByClassName("modal_canvas");
let modalData = document.getElementsByClassName("modal_data")[0];
let rastrCanvas = document.getElementById("canv");

export class CellViewer {

    preload = () => {
        if (!this.preloaded) {
            this.width = canvasContainer[0].clientWidth - (canvasContainer[0].clientWidth % 10);
            this.height = canvasContainer[0].clientHeight - (canvasContainer[0].clientHeight % 10);

            modalCanvas.setAttribute("width", `${this.width}px`);
            modalCanvas.setAttribute("height", `${this.height}px`);

            let context = modalCanvas.getContext("2d");

            this.gridDrive = new GridDrive(context, this.height, this.width, 10);

            this.gridDrive.initEmpty();

            this.envDrive = new EnvDrive(this.gridDrive);

            this.gridDrive.envDrive = this.envDrive;

            this.preloaded = true;
        }
    }

    init = (baseGridDrive) => {
        let cellViewer = this;

        closeElement.onclick = function () {
            modal.style.display = "none";
            cellViewer.closeCellViever()
        }

        rastrCanvas.onclick = function (event) {
            let x = event.pageX - rastrCanvas.offsetLeft;
            let y = event.pageY - rastrCanvas.offsetTop;

            let cell = baseGridDrive.getCellOnCanvas(x, y);

            if (cell instanceof Cell) {
                let cellData = {}
                cellData.name = "cell"
                cellData.type = cell.type.name;
                cellData.color = cell.type.color;
                cellData.life = cell.tree.life;
                cellData.treeEnergy = Math.floor(cell.tree.energy);
                cellData.cellCount = cell.tree.cells.length;
                cellData.x = cell.x
                cellData.y = cell.y
                cellData.energy = Math.floor(cell.tenergy)
                cellData.generation = cell.tree.generation

                if (cell.tree) {
                    cellData.geneArray = cell.tree.geneArray;
                } else {
                    cellData.geneArray = cell.geneArray;
                }

                cellViewer.openCellViewer(cellData);
            }
        }

    }

    openCellViewer(cellData) {

        modal.style.display = "block";

        cellType.textContent = `Cell type - ${cellData.type}`;
        cellType.setAttribute("style", `color:${cellData.color}`);

        treeEnegy.textContent = `Tree energy - ${cellData.treeEnergy}`;
        treeLife.textContent = `Tree life - ${cellData.life}`;
        treeCellCount.textContent = `Tree cell count - ${cellData.cellCount}`;
        generation.textContent = `Generation - ${cellData.generation}`;

        posX.textContent = `Cell x pos - ${cellData.x}`;
        posY.textContent = `Cell y pos - ${cellData.y}`;
        cellEnergy.textContent = `Cell energy - ${cellData.energy}`;
      

        this.preload()
        this.vievRunner = this.envDrive.viewTreeRun(cellData, Math.floor(this.width / 20), 1000, 200)
        //console.log(this.vievRunner)
    }

    closeCellViever() {
        this.vievRunner.run = false;
    }
}




