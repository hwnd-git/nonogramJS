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
    let rowsStyleString = '';
    let templateAreasString = '';
    
    //columns template
    for (let colNo = 1; colNo <= columnsQty; colNo++) {
        
        let currentColumnWidth = ''

        if (colNo == columnsQty) {
            currentColumnWidth = `${cellFullSize}`;
        } else {
            currentColumnWidth = `${cellReducedSize} `;
        }

        debugger;
        if (colNo % 5 == 0 && colNo != columnsQty) {
            currentColumnWidth = currentColumnWidth.concat(`${separatorWidth} `);
        }

        columnsStyleString = columnsStyleString.concat(currentColumnWidth);
    }

    //rows template
    for (let rowNo = 1; rowNo <= gridHeight; rowNo++) {
        if (rowNo == gridHeight) {
            rowsStyleString = rowsStyleString.concat(`${cellFullSize}`);
        } else {
            rowsStyleString = rowsStyleString.concat(`${cellReducedSize} `);
        }
    }
    
    //grid areas
    for (let rowNo = gridHeight; rowNo >= 1; rowNo--) {
        templateAreasString = templateAreasString.concat('"');
        for (let colNo = 1; colNo <= columnsQty; colNo++) {
            let currentArea = '';

            if (colNo == columnsQty) {
                currentArea = `a${colNo}-${rowNo}" `;
            } else {
                currentArea = `a${colNo}-${rowNo} `;
            }

            if (colNo % 5 == 0 && colNo != columnsQty) {
                let multiplier = colNo / 5;
                currentArea = currentArea.concat(`s${multiplier} `);
            }

            templateAreasString = templateAreasString.concat(currentArea);
        }
    }
    
    console.log(templateAreasString);

    const legendElement = document.getElementById('legend-horizontal')
    legendElement.style.gridTemplateColumns = columnsStyleString;
    legendElement.style.gridTemplateRows = rowsStyleString;
    legendElement.style.gridTemplateAreas = `${templateAreasString}`;

    for (let colNo = 1; colNo <= columnsQty; colNo++) {
        for (let rowNo = 1; rowNo <= gridHeight; rowNo++) {
            let cell = document.createElement('div');
            let no = gridHeight - rowNo + 1;
            cell.className = 'cell cell-legend';
            cell.id = `col${colNo}-${rowNo}`;
            cell.style.gridColumnStart = `${colNo}`;
            cell.style.gridRowStart = `${no}`;
            cell.style.gridArea = `a${colNo}-${no}`;

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
            //cell.style.gridArea = `${colNo}-${rowNo}`;

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