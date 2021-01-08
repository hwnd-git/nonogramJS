import * as config from './nConfig.js';
import * as utils from './nUtils.js';

const param = config.settings;
export const grid = document.getElementById('game-grid');



function generateGameGridAreasString() {
    const width = param.width.value;
    const height = param.height.value;
    const sepSpacing = param.separatorSpacing.value;

    let templateAreasString = '';

    for (let rowNo = 1; rowNo <= height; rowNo++) {
        templateAreasString = templateAreasString.concat('"');
        for (let colNo = 1; colNo <= width; colNo++) {
            let currentArea = '';

            if (colNo == width) {
                currentArea = `a${colNo}-${rowNo}" `;
            } else {
                currentArea = `a${colNo}-${rowNo} `;
            }

            if (colNo % sepSpacing == 0 && colNo != width) {
                let segmentsCounter = Math.floor((parseInt(rowNo) - 1) / sepSpacing) + 1;
                let multiplier = colNo / sepSpacing;
                currentArea = currentArea.concat(`sv${multiplier}-${segmentsCounter} `);
            }

            templateAreasString = templateAreasString.concat(currentArea);
        }

        if (rowNo % sepSpacing == 0 && rowNo != height) {
            let currentArea = '"';
            let multiplier = rowNo / sepSpacing;
            let widthWithSeparators = parseInt(width) + Math.floor((width - 1) / sepSpacing);
            for (let colNo = 1; colNo <= widthWithSeparators; colNo++) {
                if (colNo == widthWithSeparators) {
                    currentArea = currentArea.concat(`sh${multiplier}" `);
                } else {
                    currentArea = currentArea.concat(`sh${multiplier} `);
                }
            }
            templateAreasString = templateAreasString.concat(currentArea);
        }
    }

    return templateAreasString;
}

function generateGameGridTemplateStrings() {
    const width = param.width.value;
    const height = param.height.value;
    const cellSize = param.cellSize.value;
    const cellSizeReduced = param.cellSizeReduced.value;
    const sepSpacing = param.separatorSpacing.value;

    let columnsStyleString = '';
    let rowsStyleString = '';

    //columns template
    for (let colNo = 1; colNo <= width; colNo++) {

        let currentColumnWidth = ''

        if (colNo == width) {
            currentColumnWidth = `${cellSize}`;
        } else if (colNo % sepSpacing == 0) {
            currentColumnWidth = `${cellSize} `;
        } else {
            currentColumnWidth = `${cellSizeReduced} `;
        }

        if (colNo % sepSpacing == 0 && colNo != width) {
            currentColumnWidth = currentColumnWidth.concat(`max-content `);
        }

        columnsStyleString = columnsStyleString.concat(currentColumnWidth);
    }

    //rows template
    for (let rowNo = 1; rowNo <= height; rowNo++) {

        let currentRowWidth = ''

        if (rowNo == height) {
            currentRowWidth = `${cellSize}`;
        } else if (rowNo % sepSpacing == 0) {
            currentRowWidth = `${cellSize} `;
        } else {
            currentRowWidth = `${cellSizeReduced} `;
        }

        if (rowNo % sepSpacing == 0 && rowNo != height) {
            currentRowWidth = currentRowWidth.concat(`auto `);
        }
        rowsStyleString = rowsStyleString.concat(currentRowWidth);
    }

    return { row: rowsStyleString, col: columnsStyleString };
}

export function update() {
    updateAreas();
    updateTemplate();
    // addMissingCells();
    updateCells();
    //addSeparators();
    updateSeparators();
}

export function populateGrid() {
    const width = param.width.value;
    const height = param.height.value;

    let columnsStyleString = generateGameGridTemplateStrings().col;
    let rowsStyleString = generateGameGridTemplateStrings().row;
    let templateAreasString = generateGameGridAreasString();

    grid.style.gridTemplateColumns = columnsStyleString;
    grid.style.gridTemplateRows = rowsStyleString;
    grid.style.gridTemplateAreas = templateAreasString;

    for (let colNo = 1; colNo <= width; colNo++) {
        for (let rowNo = 1; rowNo <= height; rowNo++) {
            addGameCell(colNo, rowNo);
        }
    }

    addSeparators();
}

function updateAreas() {
    grid.style.gridTemplateAreas = generateGameGridAreasString();
}

function updateTemplate() {
    const templates = generateGameGridTemplateStrings();
    grid.style.gridTemplateRows = templates.row;
    grid.style.gridTemplateColumns = templates.col;
}

function addGameCell(colNo, rowNo) {
    if (document.getElementById(`cell${colNo}-${rowNo}`)) return;

    if (!document.getElementById(`cell${colNo}-${rowNo}`)) {
        let cell = document.createElement('div');
        cell.className = 'cell cell-game';
        cell.id = `cell${colNo}-${rowNo}`;
        cell.style.gridArea = `a${colNo}-${rowNo}`;

        grid.appendChild(cell);
    }
}

function addMissingCells() {
    const width = param.width.value;
    const height = param.height.value;

    //locate first missing column number
    let emptyColNo = 0;
    for (let colNo = 1; colNo <= width; colNo++) {
        let cell = document.getElementById(`cell${colNo}-1`);
        if (!cell) {
            emptyColNo = colNo;
            break;
        }
    }

    //locate first missing row number
    let emptyRowNo = 0;
    for (let rowNo = 1; rowNo <= height; rowNo++) {
        let cell = document.getElementById(`cell1-${rowNo}`);
        if (!cell) {
            emptyRowNo = rowNo;
            break;
        }
    }

    const cellPopupTime = 25;
    let cellRowPopupTime = cellPopupTime;
    let cellColPopupTime = cellPopupTime;
    const columnAnimationTime = cellPopupTime * height;
    const rowAnimationTime = cellPopupTime * width;
    const longerAnimationTime = Math.max(columnAnimationTime, rowAnimationTime)

    if (emptyRowNo > 0 && emptyColNo > 0) {
        cellRowPopupTime = longerAnimationTime / width;
        cellColPopupTime = longerAnimationTime / height;
    }

    //adding cells to empty row
    if (emptyRowNo > 0) {
        for (let colNo = 1; colNo <= width; colNo++) {
            setTimeout(function () {
                addGameCell(colNo, emptyRowNo)
            }, colNo * cellRowPopupTime)
            //addGameGridCell(colNo, emptyRowNo);
        }
    }

    //adding cells to empty column
    if (emptyColNo > 0) {
        for (let rowNo = 1; rowNo <= height; rowNo++) {
            setTimeout(function () {
                addGameCell(emptyColNo, rowNo);
            }, rowNo * cellColPopupTime)
        }
    }
}

function removeGameCell(colNo, rowNo) {
    let cell = document.getElementById(`cell${colNo}-${rowNo}`);
    if (!cell) return;

    cell.parentElement.removeChild(cell);
}

function updateCells() {
    const columnsQty = param.width.value;
    const rowsQty = param.height.value;
    const cellsQty = columnsQty * rowsQty;

    addMissingCells();

    //v-separators:
    const allCells = document.querySelectorAll('.cell-game');
    let excessCellsQty = allCells.length - cellsQty;
    let removedCellsQty = 0;
    if (excessCellsQty > 0) {
        for (let cellNo = allCells.length; cellNo >= 1; cellNo--) {
            const currCell = allCells.item(cellNo - 1);
            //debugger;
            const currCellCol = utils.getColumnNo(currCell);
            const currCellRow = utils.getRowNo(currCell);
            if (currCellCol > columnsQty || currCellRow > rowsQty) {
                removeGameCell(currCellCol, currCellRow);
                removedCellsQty++;
            }
            if (removedCellsQty >= excessCellsQty) break;
        }
    }
}

function addSeparatorH(sepNo) {
    if (document.getElementById(`sep-gameH-${sepNo}`)) return;

    const separator = document.createElement('div');
    separator.id = `sep-gameH-${sepNo}`;
    separator.classList.add('separator', 'sep-h', 'sep-game', 'sep-game-h');
    separator.style.gridArea = `sh${sepNo}`;
    grid.appendChild(separator);
}

function addSeparatorV(sepNo1, sepNo2) {
    if (document.getElementById(`sep-gameV-${sepNo1}-${sepNo2}`)) return;

    const separator = document.createElement('div');
    separator.id = `sep-gameV-${sepNo1}-${sepNo2}`;
    separator.classList.add('separator', 'sep-v', 'sep-game', 'sep-game-v');
    separator.style.gridArea = `sv${sepNo1}-${sepNo2}`;
    grid.appendChild(separator);
}

function addSeparators() {
    const width = param.width.value;
    const height = param.height.value;
    const sepSpacing = param.separatorSpacing.value;

    const hSeparatorQty = Math.floor((height - 1) / sepSpacing);
    for (let sepNo = 1; sepNo <= hSeparatorQty; sepNo++) {
        addSeparatorH(sepNo);
    }

    const vBreaksQty = Math.floor((width - 1) / sepSpacing);
    const vSepPerBreakQty = hSeparatorQty + 1;
    for (let sepNo1 = 1; sepNo1 <= vBreaksQty; sepNo1++) {
        for (let sepNo2 = 1; sepNo2 <= vSepPerBreakQty; sepNo2++) {
            addSeparatorV(sepNo1, sepNo2)
        }
    }
}

function removeSeparatorH(sepNo) {
    let separator = document.getElementById(`sep-gameH-${sepNo}`);
    if (!separator) return;
    
    separator.parentElement.removeChild(separator);
}

function removeSeparatorV(sepNo1, sepNo2) {
    let separator = document.getElementById(`sep-gameV-${sepNo1}-${sepNo2}`);
    if (!separator) return;
    
    separator.parentElement.removeChild(separator);
}

function updateSeparators() {
    const rowsQty = param.height.value;
    const columnsQty = param.width.value;
    const sepSpacing = param.separatorSpacing.value;
    const separatorHQty = Math.floor((rowsQty - 1) / sepSpacing);

    const vBreaksQty = Math.floor((columnsQty - 1) / sepSpacing);
    const vSepPerBreakQty = separatorHQty + 1;
    const separatorVQty = vBreaksQty * vSepPerBreakQty;

    addSeparators();

    //h-separators:
    const allSeparatorsH = document.querySelectorAll('.sep-game-h');
    let excessSepHQty = allSeparatorsH.length - separatorHQty;
    let removedSepHQty = 0;
    if (excessSepHQty > 0) {
        for (let sepNo = allSeparatorsH.length; sepNo >= 1; sepNo--) {
            const currSepH = allSeparatorsH.item(sepNo - 1);
            const currSepHNo = utils.getSeparatorNo(currSepH);
            if (currSepHNo > separatorHQty) {
                removeSeparatorH(currSepHNo);
                removedSepHQty++;
            }
            if (removedSepHQty >= excessSepHQty) break;
        }
    }

    //v-separators:
    const allSeparatorsV = document.querySelectorAll('.sep-game-v');
    let excessSepVQty = allSeparatorsV.length - separatorVQty;
    let removedSepVQty = 0;
    if (excessSepVQty > 0) {
        for (let sepNo = allSeparatorsV.length; sepNo >= 1; sepNo--) {
            const currSepV = allSeparatorsV.item(sepNo - 1);
            //debugger;
            const currSepVNo1 = utils.getSeparatorNo(currSepV).no1;
            const currSepVNo2 = utils.getSeparatorNo(currSepV).no2;
            if (currSepVNo1 > vBreaksQty || currSepVNo2 > vSepPerBreakQty) {
                removeSeparatorV(currSepVNo1, currSepVNo2);
                removedSepVQty++;
            }
            if (removedSepVQty >= excessSepVQty) break;
        }
    }
}