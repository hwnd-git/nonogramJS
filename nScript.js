import * as utils from './nUtils.js';
import * as config from './nConfig.js';
import * as events from './nEvents.js';
import * as top from './nTopLegend.js';

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

    let columnsStyleString = generateTopLegendTemplateStrings().col;
    let templateAreasString = generateTopLegendAreasString();

    const legendElement = document.getElementById('legend-top')
    legendElement.style.gridTemplateColumns = columnsStyleString;
    legendElement.style.gridTemplateAreas = `${templateAreasString}`;

    for (let colNo = 1; colNo <= columnsQty; colNo++) {
        addTopLegendColumn(colNo);
    }

    addTopSeparators();
}

function populateSideLegend() {
    const rowsQty = par.height.value;

    let rowsStyleString = generateSideLegendTemplateStrings().row;
    let templateAreasString = generateSideLegendAreasString();

    const legendElement = document.getElementById('legend-side')
    legendElement.style.gridTemplateRows = rowsStyleString;
    legendElement.style.gridTemplateAreas = templateAreasString;

    for (let rowNo = 1; rowNo <= rowsQty; rowNo++) {
        addSideLegendRow(rowNo);
    }

    addSideSeparators();
}

function populateGameGrid() {
    const width = par.width.value;
    const height = par.height.value;

    let columnsStyleString = generateGameGridTemplateStrings().col;
    let rowsStyleString = generateGameGridTemplateStrings().row;
    let templateAreasString = generateGameGridAreasString();

    const legendElement = document.getElementById('game-grid')
    legendElement.style.gridTemplateColumns = columnsStyleString;
    legendElement.style.gridTemplateRows = rowsStyleString;
    legendElement.style.gridTemplateAreas = templateAreasString;

    for (let colNo = 1; colNo <= width; colNo++) {
        for (let rowNo = 1; rowNo <= height; rowNo++) {
            addGameGridCell(colNo, rowNo);
        }
    }

    addGameSeparators();
}

//TODO: zamiast funkcji update, wydajniej byłoby używać funkcji która
// nie generuje całego stringa od nowa, tylko bierze istniejący i tylko
// go modyfikuje

export function expandWidth() {
    const widthSetting = par.width;
    config.updateSetting(widthSetting, `${parseInt(widthSetting.value) + 1}`);

    updateTopLegendAreas();
    updateTopLegendTemplate();
    addTopLegendColumn(widthSetting.value);
    addTopSeparators();

    updateGameGridAreas();
    updateGameGridTemplate();
    addGameGridMissingCells();
    addGameSeparators();

    console.log('New width: ', widthSetting.value);
}

export function expandHeight() {
    const heightSetting = par.height;
    config.updateSetting(heightSetting, `${parseInt(heightSetting.value) + 1}`);

    updateSideLegendAreas();
    updateSideLegendTemplate();
    addSideLegendRow(heightSetting.value);
    addSideSeparators();

    updateGameGridAreas();
    updateGameGridTemplate();
    addGameGridMissingCells();
    addGameSeparators();

    console.log('New height: ', heightSetting.value);
}

export function expandSize() {
    const widthSetting = par.width;
    config.updateSetting(widthSetting, `${parseInt(widthSetting.value) + 1}`);

    const heightSetting = par.height;
    config.updateSetting(heightSetting, `${parseInt(heightSetting.value) + 1}`);

    updateTopLegendAreas();
    updateSideLegendAreas();
    updateGameGridAreas();

    updateTopLegendTemplate();
    updateSideLegendTemplate();
    updateGameGridTemplate();

    addTopLegendColumn(widthSetting.value);
    addSideLegendRow(heightSetting.value);
    addGameGridMissingCells();

    addTopSeparators();
    addSideSeparators();
    addGameSeparators();
}

function generateTopLegendAreasString() {
    const columnsQty = par.width.value;
    const sepSpacing = par.separatorSpacing.value;

    let templateAreasString = '';

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
    return templateAreasString;
}

function generateSideLegendAreasString() {
    const rowsQty = par.height.value;
    const sepSpacing = par.separatorSpacing.value;

    let templateAreasString = '';

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
    return templateAreasString;
}

function generateGameGridAreasString() {
    const width = par.width.value;
    const height = par.height.value;
    const sepSpacing = par.separatorSpacing.value;

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

function updateTopLegendAreas() {
    const topLegend = document.getElementById('legend-top');
    topLegend.style.gridTemplateAreas = generateTopLegendAreasString();
}

function updateSideLegendAreas() {
    const sideLegend = document.getElementById('legend-side');
    sideLegend.style.gridTemplateAreas = generateSideLegendAreasString();
}

function updateGameGridAreas() {
    const gameGrid = document.getElementById('game-grid');
    gameGrid.style.gridTemplateAreas = generateGameGridAreasString();
}

function generateTopLegendTemplateStrings() {
    const columnsQty = par.width.value;
    const legendHeight = par.topLegendHeight.value;
    const cellSize = par.cellSize.value;
    const cellSizeReduced = par.cellSizeReduced.value;
    const sepSpacing = par.separatorSpacing.value;

    //columns template
    let columnsStyleString = '';
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
            currentColumnWidth = currentColumnWidth.concat(`max-content `);
        }

        columnsStyleString = columnsStyleString.concat(currentColumnWidth);
    }

    //rows template
    let rowsStyleString = '';
    for (let rowNo = 1; rowNo <= legendHeight; rowNo++) {
        if (rowNo == legendHeight) {
            rowsStyleString = rowsStyleString.concat(`${cellSize}`);
        } else {
            rowsStyleString = rowsStyleString.concat(`${cellSizeReduced} `);
        }
    }

    return { col: columnsStyleString, row: rowsStyleString };
}

function generateSideLegendTemplateStrings() {
    const rowsQty = par.height.value;
    const legendWidth = par.sideLegendWidth.value;
    const cellSize = par.cellSize.value;
    const cellSizeReduced = par.cellSizeReduced.value;
    const sepSpacing = par.separatorSpacing.value;

    //rows template
    let rowsStyleString = '';
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
            currentRowWidth = currentRowWidth.concat(`auto `);
        }
        rowsStyleString = rowsStyleString.concat(currentRowWidth);
    }

    //columns template
    let columnsStyleString = '';
    for (let colNo = 1; colNo <= legendWidth; colNo++) {
        if (colNo == legendWidth) {
            columnsStyleString = columnsStyleString.concat(`${cellSize}`);
        } else {
            columnsStyleString = columnsStyleString.concat(`${cellSizeReduced} `);
        }
    }

    return { col: columnsStyleString, row: rowsStyleString };
}

function generateGameGridTemplateStrings() {
    const width = par.width.value;
    const height = par.height.value;
    const cellSize = par.cellSize.value;
    const cellSizeReduced = par.cellSizeReduced.value;
    const sepSpacing = par.separatorSpacing.value;

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

function updateTopLegendTemplate() {

    const topLegend = document.getElementById('legend-top');
    topLegend.style.gridTemplateColumns = generateTopLegendTemplateStrings().col;
}

function updateSideLegendTemplate() {
    const sideLegend = document.getElementById('legend-side');
    sideLegend.style.gridTemplateRows = generateSideLegendTemplateStrings().row;
}

function updateGameGridTemplate() {
    const gameGrid = document.getElementById('game-grid');
    const templates = generateGameGridTemplateStrings();
    gameGrid.style.gridTemplateRows = templates.row;
    gameGrid.style.gridTemplateColumns = templates.col;
}

function addTopLegendColumn(colNo) {
    const topLegend = document.getElementById('legend-top');
    //const firstColumn = document.getElementById('col1');
    const rowsStyleString = generateTopLegendTemplateStrings().row;

    const gridHeight = par.topLegendHeight.value;

    if (!document.getElementById(`col${colNo}`)) {
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
            // cell.className = 'cell-legend';
            cell.id = `top${colNo}-${rowNo}`;
            cell.style.gridArea = `a${colNo}-${rowNo}`;
            col.appendChild(cell);
        }

        col.style.gridTemplateAreas = columnGridTemplateString;
        topLegend.appendChild(col);
    }
}

function addSideLegendRow(rowNo) {
    const sideLegend = document.getElementById('legend-side');
    const columnsStyleString = generateSideLegendTemplateStrings().col;

    const gridWidth = par.sideLegendWidth.value;

    if (!document.getElementById(`row${rowNo}`)) {
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
        sideLegend.appendChild(row);
    }
}

function addGameGridCell(colNo, rowNo) {
    const gameGrid = document.getElementById('game-grid');

    if (!document.getElementById(`cell${colNo}-${rowNo}`)) {
        let cell = document.createElement('div');
        cell.className = 'cell cell-game';
        cell.id = `cell${colNo}-${rowNo}`;
        cell.style.gridArea = `a${colNo}-${rowNo}`;

        gameGrid.appendChild(cell);
    }
}

function addGameGridMissingCells() {
    const width = par.width.value;
    const height = par.height.value;

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
                addGameGridCell(colNo, emptyRowNo)
            }, colNo * cellRowPopupTime)
            //addGameGridCell(colNo, emptyRowNo);
        }
    }

    //adding cells to empty column
    if (emptyColNo > 0) {
        for (let rowNo = 1; rowNo <= height; rowNo++) {
            setTimeout(function () {
                addGameGridCell(emptyColNo, rowNo);
            }, rowNo * cellColPopupTime)
        }
    }
}

function addTopSeparators() {
    const columnsQty = par.width.value;
    const sepSpacing = par.separatorSpacing.value;
    const topLegend = document.getElementById('legend-top');

    const separatorQty = (columnsQty - 1) / sepSpacing;
    for (let i = 1; i <= separatorQty; i++) {
        if (!document.getElementById(`sep-top-${i}`)) {
            const separator = document.createElement('div');
            separator.id = `sep-top-${i}`;
            separator.classList.add('separator', 'sep-v', 'sep-top');
            separator.style.gridArea = `sv${i}`;
            topLegend.appendChild(separator);
        }
    }
}

function addSideSeparators() {
    const rowsQty = par.height.value;
    const sepSpacing = par.separatorSpacing.value;
    const sideLegend = document.getElementById('legend-side');

    const separatorQty = (rowsQty - 1) / sepSpacing;
    for (let i = 1; i <= separatorQty; i++) {
        if (!document.getElementById(`sep-side-${i}`)) {
            const separator = document.createElement('div');
            separator.id = `sep-side-${i}`;
            separator.classList.add('separator', 'sep-h', 'sep-side');
            separator.style.gridArea = `sh${i}`;
            sideLegend.appendChild(separator);
        }
    }
}

function addGameSeparators() {
    const width = par.width.value;
    const height = par.height.value;
    const sepSpacing = par.separatorSpacing.value;
    const gameGrid = document.getElementById('game-grid');

    //adding separators
    const hSeparatorQty = (height - 1) / sepSpacing;
    for (let i = 1; i <= hSeparatorQty; i++) {
        if (!document.getElementById(`sep-game-h-${i}`)) {
            const separator = document.createElement('div');
            separator.id = `sep-game-h-${i}`;
            separator.classList.add('separator', 'sep-h', 'sep-game');
            separator.style.gridArea = `sh${i}`;
            gameGrid.appendChild(separator);
        }
    }

    const vBreaksQty = (width - 1) / sepSpacing;
    const vSepPerBreakQty = hSeparatorQty + 1;
    for (let i = 1; i <= vBreaksQty; i++) {
        for (let j = 1; j <= vSepPerBreakQty; j++) {
            if (!document.getElementById(`sep-game-v-${i}-${j}`)) {
                const separator = document.createElement('div');
                separator.id = `sep-game-v${i}-${j}`;
                separator.classList.add('separator', 'sep-v', 'sep-game');
                separator.style.gridArea = `sv${i}-${j}`;
                gameGrid.appendChild(separator);
            }
        }
    }
}

