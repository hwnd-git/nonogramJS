import * as utils from './nUtils.js';

const cellFullSize = utils.getCSSVariable('--cell-size');
const cellReducedSize = utils.getCSSVariable('--cell-size-reduced');
const separatorWidth = utils.getCSSVariable('--separator-width');
const separatorSpacing = utils.getCSSVariable('--separator-spacing');

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

    let columnsStyleString = '';
    let rowsStyleString = '';
    let templateAreasString = '';

    //columns template
    for (let colNo = 1; colNo <= columnsQty; colNo++) {

        let currentColumnWidth = ''

        if (colNo == columnsQty) {
            currentColumnWidth = `${cellFullSize}`;
        } else if (colNo % separatorSpacing == 0) {
            currentColumnWidth = `${cellFullSize} `;
        } else {
            currentColumnWidth = `${cellReducedSize} `;
        }

        if (colNo % separatorSpacing == 0 && colNo != columnsQty) {
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
    templateAreasString = templateAreasString.concat('"');
    for (let colNo = 1; colNo <= columnsQty; colNo++) {
        let currentArea = '';

        if (colNo == columnsQty) {
            currentArea = `col${colNo}" `;
        } else {
            currentArea = `col${colNo} `;
        }

        if (colNo % separatorSpacing == 0 && colNo != columnsQty) {
            let multiplier = colNo / separatorSpacing;
            currentArea = currentArea.concat(`sv${multiplier} `);
        }
        templateAreasString = templateAreasString.concat(currentArea);
    }


    const legendElement = document.getElementById('legend-horizontal')
    legendElement.style.gridTemplateColumns = columnsStyleString;
    legendElement.style.gridTemplateAreas = `${templateAreasString}`;

    //adding columns
    for (let colNo = 1; colNo <= columnsQty; colNo++) {
        let col = document.createElement('div');
        col.className = 'legend-column';
        col.id = `col${colNo}`;
        col.style.gridArea = `col${colNo}`;
        col.style.gridTemplateRows = rowsStyleString;

        //adding cells and areas
        let columnGridTemplateString = '';
        for (let rowNo = gridHeight; rowNo >= 1; rowNo--) {
            columnGridTemplateString = columnGridTemplateString.concat(`"a${colNo}-${rowNo}" `)

            let cell = document.createElement('div');
            cell.className = 'cell cell-legend';
            cell.id = `top${colNo}-${rowNo}`;
            cell.style.gridArea = `a${colNo}-${rowNo}`;
            col.appendChild(cell);
        }

        col.style.gridTemplateAreas = columnGridTemplateString;
        legendElement.appendChild(col);
    }

    //adding separators
    const separatorQty = (columnsQty - 1) / separatorSpacing;
    for (let i = 1; i <= separatorQty; i++) {
        const separator = document.createElement('div');
        separator.id = `sep-top-${i}`;
        separator.classList.add('separator', 'separator-v', 'separator-top');
        separator.style.gridArea = `sv${i}`;
        legendElement.appendChild(separator);
    }
}

function populateSideLegend() {
    const rowsQty = utils.getCSSVariable('--stage-v-size');
    const gridWidth = utils.getCSSVariable('--legend-v-size');

    let rowsStyleString = '';
    let columnsStyleString = '';
    let templateAreasString = '';

    //rows template
    for (let rowNo = 1; rowNo <= rowsQty; rowNo++) {

        let currentRowWidth = ''

        if (rowNo == rowsQty) {
            currentRowWidth = `${cellFullSize}`;
        } else if (rowNo % separatorSpacing == 0) {
            currentRowWidth = `${cellFullSize} `;
        } else {
            currentRowWidth = `${cellReducedSize} `;
        }

        if (rowNo % separatorSpacing == 0 && rowNo != rowsQty) {
            currentRowWidth = currentRowWidth.concat(`${separatorWidth} `);
        }
        rowsStyleString = rowsStyleString.concat(currentRowWidth);
    }

    //columns template
    for (let colNo = 1; colNo <= gridWidth; colNo++) {
        if (colNo == gridWidth) {
            columnsStyleString = columnsStyleString.concat(`${cellFullSize}`);
        } else {
            columnsStyleString = columnsStyleString.concat(`${cellReducedSize} `);
        }
    }

    //grid areas
    templateAreasString = templateAreasString.concat('');
    for (let rowNo = 1; rowNo <= rowsQty; rowNo++) {
        let currentArea = `"row${rowNo}" `;
        templateAreasString = templateAreasString.concat(currentArea);

        if (rowNo % separatorSpacing == 0 && rowNo != rowsQty) {
            let multiplier = rowNo / separatorSpacing;
            let currentArea = `"sh${multiplier}" `;
            templateAreasString = templateAreasString.concat(currentArea);
        }
    }

    const legendElement = document.getElementById('legend-vertical')
    legendElement.style.gridTemplateRows = rowsStyleString;
    legendElement.style.gridTemplateAreas = `${templateAreasString}`;

    //adding rows
    for (let rowNo = 1; rowNo <= rowsQty; rowNo++) {
        let row = document.createElement('div');
        row.className = 'legend-row';
        row.id = `row${rowNo}`;
        row.style.gridArea = `row${rowNo}`;
        row.style.gridTemplateColumns = columnsStyleString;

        //adding cells and areas
        let rowGridTemplateString = '"';
        for (let colNo = gridWidth; colNo >= 1; colNo--) {
            let areaPart = ''
            if (colNo == 1) {
                areaPart = `a${colNo}-${rowNo}"`;
            } else {
                areaPart = `a${colNo}-${rowNo} `;
            }
            rowGridTemplateString = rowGridTemplateString.concat(areaPart)

            let cell = document.createElement('div');
            cell.className = 'cell cell-legend';
            cell.id = `side${colNo}-${rowNo}`;
            cell.style.gridArea = `a${colNo}-${rowNo}`;
            row.appendChild(cell);
        }

        row.style.gridTemplateAreas = rowGridTemplateString;
        legendElement.appendChild(row);
    }

    //adding separators
    const separatorQty = (rowsQty - 1) / separatorSpacing;
    for (let i = 1; i <= separatorQty; i++) {
        const separator = document.createElement('div');
        separator.id = `sep-side-${i}`;
        separator.classList.add('separator', 'separator-h', 'separator-side');
        separator.style.gridArea = `sh${i}`;
        legendElement.appendChild(separator);
    }
}

function populateGameGrid() {
    const width = utils.getCSSVariable('--stage-h-size');
    const height = utils.getCSSVariable('--stage-v-size');

    let columnsStyleString = '';
    let rowsStyleString = '';
    let templateAreasString = '';

    //columns template
    for (let colNo = 1; colNo <= width; colNo++) {

        let currentColumnWidth = ''

        if (colNo == width) {
            currentColumnWidth = `${cellFullSize}`;
        } else if (colNo % separatorSpacing == 0) {
            currentColumnWidth = `${cellFullSize} `;
        } else {
            currentColumnWidth = `${cellReducedSize} `;
        }

        if (colNo % separatorSpacing == 0 && colNo != width) {
            currentColumnWidth = currentColumnWidth.concat(`${separatorWidth} `);
        }

        columnsStyleString = columnsStyleString.concat(currentColumnWidth);
    }

    //rows template
    for (let rowNo = 1; rowNo <= height; rowNo++) {

        let currentRowWidth = ''

        if (rowNo == height) {
            currentRowWidth = `${cellFullSize}`;
        } else if (rowNo % separatorSpacing == 0) {
            currentRowWidth = `${cellFullSize} `;
        } else {
            currentRowWidth = `${cellReducedSize} `;
        }

        if (rowNo % separatorSpacing == 0 && rowNo != height) {
            currentRowWidth = currentRowWidth.concat(`${separatorWidth} `);
        }
        rowsStyleString = rowsStyleString.concat(currentRowWidth);
    }

    //grid areas
    for (let rowNo = 1; rowNo <= height; rowNo++) {
        templateAreasString = templateAreasString.concat('"');
        for (let colNo = 1; colNo <= width; colNo++) {
            let currentArea = '';

            if (colNo == width) {
                currentArea = `a${colNo}-${rowNo}" `;
            } else {
                currentArea = `a${colNo}-${rowNo} `;
            }

            if (colNo % separatorSpacing == 0 && colNo != width) {
                let segmentsCounter = Math.floor((parseInt(rowNo) - 1) / separatorSpacing) + 1;
                let multiplier = colNo / separatorSpacing;
                currentArea = currentArea.concat(`sv${multiplier}-${segmentsCounter} `);
            }

            templateAreasString = templateAreasString.concat(currentArea);
        }

        if (rowNo % separatorSpacing == 0 && rowNo != height) {
            let currentArea = '"';
            let multiplier = rowNo / separatorSpacing;
            let widthWithSeparators = parseInt(width) + Math.floor((width - 1) / separatorSpacing);
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


    const legendElement = document.getElementById('game-grid')
    legendElement.style.gridTemplateColumns = columnsStyleString;
    legendElement.style.gridTemplateRows = rowsStyleString;
    legendElement.style.gridTemplateAreas = templateAreasString;

    //adding cells
    for (let colNo = 1; colNo <= width; colNo++) {
        for (let rowNo = 1; rowNo <= height; rowNo++) {
            let cell = document.createElement('div');
            cell.className = 'cell cell-game';
            cell.id = `cell${colNo}-${rowNo}`;
            cell.style.gridArea = `a${colNo}-${rowNo}`;

            legendElement.appendChild(cell);
        }
    }

    //adding separators
    const hSeparatorQty = (height - 1) / separatorSpacing;
    for (let i = 1; i <= hSeparatorQty; i++) {
        const separator = document.createElement('div');
        separator.id = `sep-game-h-${i}`;
        separator.classList.add('separator', 'separator-h', 'separator-game');
        separator.style.gridArea = `sh${i}`;
        legendElement.appendChild(separator);
    }
    //const vSeparatorQty = ((width - 1) / separatorSpacing) * (hSeparatorQty + 1);
    const vBreaksQty = (width - 1) / separatorSpacing;
    const vSepPerBreakQty = hSeparatorQty + 1;
    for (let i = 1; i <= vBreaksQty; i++) {
        for (let j = 1; j <= vSepPerBreakQty; j++) {
            const separator = document.createElement('div');
            separator.id = `sep-game-v${i}-${j}`;
            separator.classList.add('separator', 'separator-h', 'separator-game');
            separator.style.gridArea = `sv${i}-${j}`;
            legendElement.appendChild(separator);
        }
    }
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