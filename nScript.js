import * as utils from './nUtils.js';
import { solveChainedEquation, normalizeEquation, solveBracketsEquation } from './nEquationSolver.js';

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
    populateGameGrid();
}

function populateTopLegend() {
    const columnsQty = utils.getCSSVariable('--stage-h-size');
    const gridHeight = utils.getCSSVariable('--legend-h-size');

    const borderWidthString = utils.getCSSVariable('--cell-border');
    let borderWidthNumeric = parseInt(borderWidthString, 10);

    const cellFullSize = utils.getCSSVariable('--cell-size');
    const cellReducedSize = utils.getCSSVariable('--cell-size-reduced');
    const separatorWidth = utils.getCSSVariable('--separator-width');
    let columnsStyleString = '';
    let templateAreasString = '';

    // for (let rowNo = 1; rowNo <= gridHeight; rowNo++) {
    //     templateAreasString = templateAreasString.concat('"');

    //     for (let colNo = 1; colNo <= columnsQty; colNo++) {
    //         if (colNo == columnsQty) {
    //             columnsStyleString = columnsStyleString.concat(`${cellFullSize}`);
    //             templateAreasString = templateAreasString.concat(`${colNo}-1"`);
    //         } else {
    //             columnsStyleString = columnsStyleString.concat(`${cellReducedSize} `);
    //             templateAreasString = templateAreasString.concat(`${colNo}-${columnsQty - rowNo + 1} `);
    //         }
    //     }
    // }
    //normalizeEquation('10 + ---5*2--6 /2* ---2+1');
    //solveChainedEquation(normalizeEquation('---10 + ---5*-2-6 /2* --2+1'));
    //-10+2
    // console.log('solution: ', solveChainedEquation('---10 + ---5*-2-6 /2* --2+1'));
    // console.log('solution: ', solveChainedEquation('1---5*2+--18*1/--2'));

    console.log('solution: ', solveChainedEquation('2+1--18'));
    //console.log('solution: ', solveChainedEquation('2--18'));

    // console.log('solution: ', solveBracketsEquation('(1---5)*(2+--18)*(1/--2)'));
    //console.log(solveChainedEquation('-10+2'));

    //console.log(utils.solveMultipleMinuses('---3'));
    //utils.solveSingularEquation('-6/--3');
    //3-2-1-0
    //3---1
    //3*--2
    //3*--2-1
    //utils.countEquations('3*--2-1');

    //utils.solveChainedEquation('5---2');

    //utils.solveChainedEquation('10 + 5*2-6/2', 1);
    //utils.calcEval(utils.getCSSVariable('--test3'));
    //utils.calcEval('calc(1-2)');
    //let test = utils.evaluateCSSVariable('--test3')

    //debugger;


    const legendElement = document.getElementById('legend-horizontal')
    //grid-template-columns: repeat(calc(var(--stage-h-size) - 1), calc(var(--cell-size) - var(--cell-border))) var(--cell-size);
    legendElement.style.gridTemplateColumns = ``;

    for (let colNo = 1; colNo <= columnsQty; colNo++) {
        for (let rowNo = 1; rowNo <= gridHeight; rowNo++) {
            let cell = document.createElement('div');
            let no = gridHeight - rowNo + 1;
            cell.className = 'cell cell-legend';
            cell.id = `col${colNo}-${rowNo}`;
            cell.style.gridColumnStart = `${colNo}`;
            cell.style.gridRowStart = `${no}`;

            //translateCellToRemoveDoubleBorder(cell, borderWidthNumeric, true, false);

            legendElement.appendChild(cell);
        }
    }
}

function populateSideLegend() {
    const rowsQty = utils.getCSSVariable('--stage-v-size');
    const gridWidth = utils.getCSSVariable('--legend-v-size');
    const borderWidthString = utils.getCSSVariable('--cell-border');
    let borderWidthNumeric = parseInt(borderWidthString, 10);

    const legendElement = document.getElementById('legend-vertical')

    for (let rowNo = 1; rowNo <= rowsQty; rowNo++) {
        for (let colNo = 1; colNo <= gridWidth; colNo++) {
            let cell = document.createElement('div');
            let no = gridWidth - colNo + 1;
            cell.className = 'cell cell-legend';
            // cell.id = `row${rowNo}-${colNo}`;
            cell.id = `${colNo}-row${rowNo}`;
            cell.style.gridColumnStart = `${no}`;
            cell.style.gridRowStart = `${rowNo}`;

            //translateCellToRemoveDoubleBorder(cell, borderWidthNumeric, false, true);

            legendElement.appendChild(cell);
        }
    }
}

function populateGameGrid() {
    const width = utils.getCSSVariable('--stage-h-size');
    const height = utils.getCSSVariable('--stage-v-size');
    const borderWidthString = utils.getCSSVariable('--cell-border');
    let borderWidthNumeric = parseInt(borderWidthString, 10);

    const legendElement = document.getElementById('game-grid')

    for (let colNo = 1; colNo <= width; colNo++) {
        for (let rowNo = 1; rowNo <= height; rowNo++) {
            let cell = document.createElement('div');
            //let no = height - rowNo + 1;
            cell.className = 'cell cell-game';
            cell.id = `cell${colNo}-${rowNo}`;
            cell.style.gridColumnStart = `${colNo}`;
            cell.style.gridRowStart = `${rowNo}`;

            //translateCellToRemoveDoubleBorder(cell, borderWidthNumeric);

            legendElement.appendChild(cell);
        }
        //TODO: zmniejszyć wielkośc grida (przeliczać) po translacji komórek
    }

    const vShrink = (height - 1) * borderWidthNumeric;

}

function translateCellToRemoveDoubleBorder(cellDiv, translationValue, translateLeft = true, translateUp = true) {
    const colNo = utils.getColumnNo(cellDiv);
    const rowNo = utils.getRowNo(cellDiv);

    const left = translateLeft ? -1 : 1;
    const up = translateUp ? -1 : 1;

    if (colNo > 1 && rowNo > 1) {
        cellDiv.style.transform = `translate(${left * translationValue * (colNo - 1)}px, ${up * translationValue * (rowNo - 1)}px)`
    } else if (colNo > 1 && rowNo == 1) {
        cellDiv.style.transform = `translate(${left * translationValue * (colNo - 1)}px, 0)`
    } else if (rowNo > 1 && colNo == 1) {
        cellDiv.style.transform = `translate(0, ${up * translationValue * (rowNo - 1)}px)`
    }
}