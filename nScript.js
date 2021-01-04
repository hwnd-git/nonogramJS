import * as utils from './nUtils.js';

if (document.readyState == "loading") {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    populateGrids();
}

function populateGrids() {
    populateTopLegend();
    populateSideLegend();
}

function populateTopLegend() {
    const columnsQty = utils.getCSSVariable('--stage-h-size');
    const gridHeight = utils.getCSSVariable('--legend-h-size');

    const legendElement = document.getElementById('legend-horizontal')

    for (let colNo = 1; colNo <= columnsQty; colNo++) {
        for (let rowNo = 1; rowNo <= gridHeight; rowNo++) {
            let cell = document.createElement('div');
            let no = gridHeight - rowNo + 1;
            cell.className = 'cell cell-legend';
            cell.id = `col${colNo}-${rowNo}`;
            cell.style.gridColumnStart = `${colNo}`;
            cell.style.gridRowStart = `${no}`;
            legendElement.appendChild(cell);
        }
    }
}

function populateSideLegend() {
    const rowsQty = utils.getCSSVariable('--stage-v-size');
    const gridWidth = utils.getCSSVariable('--legend-v-size');

    const legendElement = document.getElementById('legend-vertical')

    for (let rowNo = 1; rowNo <= rowsQty; rowNo++) {
        for (let colNo = 1; colNo <= gridWidth; colNo++) {
            let cell = document.createElement('div');
            let no = gridWidth - colNo + 1;
            cell.className = 'cell cell-legend';
            cell.id = `row${rowNo}-${colNo}`;
            cell.style.gridColumnStart = `${no}`;
            cell.style.gridRowStart = `${rowNo}`;
            legendElement.appendChild(cell);
        }
    }
}