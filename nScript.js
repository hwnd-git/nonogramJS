import * as utils from './nUtils.js';
import * as config from './nConfig.js';
import * as events from './nEvents.js';

//TODO: row/column-templates ustawić na auto i niech się dopasowują do kontentu? Powinno być bardziej responsywnie.
// Najpierw sprawdzić to na separatorach.

const par = config.settings;

if (document.readyState == "loading") {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready();
}

function ready() {
    config.loadSettings();
    events.injectEventHandlers();
    populateGrids();
}

function populateGrids() {
    populateTopLegend();
    populateSideLegend();
    populateGameGrid();
}

function populateTopLegend() {
    const columnsQty = par.width.value;
    const gridHeight = par.topLegendHeight.value;
    const cellSize = par.cellSize.value;
    const cellSizeReduced = par.cellSizeReduced.value;
    const sepSpacing = par.separatorSpacing.value;

    let columnsStyleString = '';
    let rowsStyleString = '';
    let templateAreasString = '';

    //columns template
    for (let colNo = 1; colNo <= columnsQty; colNo++) {

        let currentColumnWidth = ''

        if (colNo == columnsQty) {
            currentColumnWidth = `${cellSize}`;
        } else if (colNo % sepSpacing == 0) {
            currentColumnWidth = `${cellSize} `;
        } else {
            currentColumnWidth = `${cellSizeReduced} `;
        }

        if (colNo % sepSpacing == 0 && colNo != columnsQty) {
            //currentColumnWidth = currentColumnWidth.concat(`${par.separatorWidth} `);
            // currentColumnWidth = currentColumnWidth.concat(`auto `);
            currentColumnWidth = currentColumnWidth.concat(`max-content `);
        }

        columnsStyleString = columnsStyleString.concat(currentColumnWidth);
    }

    //rows template
    for (let rowNo = 1; rowNo <= gridHeight; rowNo++) {
        if (rowNo == gridHeight) {
            rowsStyleString = rowsStyleString.concat(`${cellSize}`);
        } else {
            rowsStyleString = rowsStyleString.concat(`${cellSizeReduced} `);
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

        if (colNo % sepSpacing == 0 && colNo != columnsQty) {
            let multiplier = colNo / sepSpacing;
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
    const separatorQty = (columnsQty - 1) / sepSpacing;
    for (let i = 1; i <= separatorQty; i++) {
        const separator = document.createElement('div');
        separator.id = `sep-top-${i}`;
        separator.classList.add('separator', 'sep-v', 'sep-top');
        separator.style.gridArea = `sv${i}`;
        legendElement.appendChild(separator);
    }
}

function populateSideLegend() {
    const rowsQty = par.height.value;
    const gridWidth = par.sideLegendWidth.value;
    const cellSize = par.cellSize.value;
    const cellSizeReduced = par.cellSizeReduced.value;
    const sepSpacing = par.separatorSpacing.value;

    let rowsStyleString = '';
    let columnsStyleString = '';
    let templateAreasString = '';

    //rows template
    for (let rowNo = 1; rowNo <= rowsQty; rowNo++) {

        let currentRowWidth = ''

        if (rowNo == rowsQty) {
            currentRowWidth = `${cellSize}`;
        } else if (rowNo % sepSpacing == 0) {
            currentRowWidth = `${cellSize} `;
        } else {
            currentRowWidth = `${cellSizeReduced} `;
        }

        if (rowNo % sepSpacing == 0 && rowNo != rowsQty) {
            //currentRowWidth = currentRowWidth.concat(`${par.separatorWidth} `);
            currentRowWidth = currentRowWidth.concat(`auto `);
        }
        rowsStyleString = rowsStyleString.concat(currentRowWidth);
    }

    //columns template
    for (let colNo = 1; colNo <= gridWidth; colNo++) {
        if (colNo == gridWidth) {
            columnsStyleString = columnsStyleString.concat(`${cellSize}`);
        } else {
            columnsStyleString = columnsStyleString.concat(`${cellSizeReduced} `);
        }
    }

    //grid areas
    templateAreasString = templateAreasString.concat('');
    for (let rowNo = 1; rowNo <= rowsQty; rowNo++) {
        let currentArea = `"row${rowNo}" `;
        templateAreasString = templateAreasString.concat(currentArea);

        if (rowNo % sepSpacing == 0 && rowNo != rowsQty) {
            let multiplier = rowNo / sepSpacing;
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
    const separatorQty = (rowsQty - 1) / sepSpacing;
    for (let i = 1; i <= separatorQty; i++) {
        const separator = document.createElement('div');
        separator.id = `sep-side-${i}`;
        separator.classList.add('separator', 'sep-h', 'sep-side');
        separator.style.gridArea = `sh${i}`;
        legendElement.appendChild(separator);
    }
}

function populateGameGrid() {
    const width = par.width.value;
    const height = par.height.value;
    const cellSize = par.cellSize.value;
    const cellSizeReduced = par.cellSizeReduced.value;
    const sepSpacing = par.separatorSpacing.value;

    let columnsStyleString = '';
    let rowsStyleString = '';
    let templateAreasString = '';

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
            // currentColumnWidth = currentColumnWidth.concat(`${par.separatorWidth} `);
            currentColumnWidth = currentColumnWidth.concat(`auto `);
            // currentColumnWidth = currentColumnWidth.concat(`5px `);
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
            // currentRowWidth = currentRowWidth.concat(`${par.separatorWidth} `);
            currentRowWidth = currentRowWidth.concat(`auto `);
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
            //const translationValue = utils.calcEval(`calc(-${colNo-1}*${borderWidth})`);
            //cell.dataset.translation = translationValue;
            //cell.style.setProperty('--translation', translationValue)
            //console.log(cell.dataset.translation)

            legendElement.appendChild(cell);
        }
    }

    //adding separators
    const hSeparatorQty = (height - 1) / sepSpacing;
    for (let i = 1; i <= hSeparatorQty; i++) {
        const separator = document.createElement('div');
        separator.id = `sep-game-h-${i}`;
        separator.classList.add('separator', 'sep-h', 'sep-game');
        separator.style.gridArea = `sh${i}`;
        legendElement.appendChild(separator);
    }
    
    const vBreaksQty = (width - 1) / sepSpacing;
    const vSepPerBreakQty = hSeparatorQty + 1;
    for (let i = 1; i <= vBreaksQty; i++) {
        for (let j = 1; j <= vSepPerBreakQty; j++) {
            const separator = document.createElement('div');
            separator.id = `sep-game-v${i}-${j}`;
            separator.classList.add('separator', 'sep-v', 'sep-game');
            separator.style.gridArea = `sv${i}-${j}`;
            legendElement.appendChild(separator);
        }
    }
}

export function expandWidth() {
    
}