import * as config from './nConfig.js';
import * as utils from './nUtils.js';

const param = config.settings;
export const legend = document.getElementById('legend-top');



function generateTopLegendAreasString() {
    const columnsQty = param.width.value;
    const sepSpacing = param.separatorSpacing.value;

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

function generateTopLegendTemplateStrings() {
    const columnsQty = param.width.value;
    const legendHeight = param.topLegendHeight.value;
    const cellSize = param.cellSize.value;
    const cellSizeReduced = param.cellSizeReduced.value;
    const sepSpacing = param.separatorSpacing.value;

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

export function update() {
    //const widthSetting = param.width;

    updateAreas();
    updateTemplate();
    //addColumn(widthSetting.value);
    updateColumns();
    updateSeparators();
}

export function populateLegend() {
    let columnsStyleString = generateTopLegendTemplateStrings().col;
    let templateAreasString = generateTopLegendAreasString();

    legend.style.gridTemplateColumns = columnsStyleString;
    legend.style.gridTemplateAreas = `${templateAreasString}`;

    addColumns();
    addSeparators();
}

function updateAreas() {
    legend.style.gridTemplateAreas = generateTopLegendAreasString();
}

function updateTemplate() {
    legend.style.gridTemplateColumns = generateTopLegendTemplateStrings().col;
}

function addColumn(colNo) {
    if (document.getElementById(`col${colNo}`)) return;

    const rowsStyleString = generateTopLegendTemplateStrings().row;
    const gridHeight = param.topLegendHeight.value;

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
    legend.appendChild(col);
}

function addColumns() {
    const columnsQty = param.width.value;

    for (let colNo = 1; colNo <= columnsQty; colNo++) {
        addColumn(colNo);
    }
}

export function removeColumn(colNo) {
    let column = document.getElementById(`col${colNo}`);
    if (!column) return;

    column.parentElement.removeChild(column);
}

function updateColumns() {
    const columnsQty = param.width.value;

    //add missing columns
    addColumns();

    //remove excess columns
    const allColumns = document.querySelectorAll('.legend-column');
    let excessColQty = allColumns.length - columnsQty;
    let removedColQty = 0;
    if (excessColQty > 0) {
        for (let colNo = allColumns.length; colNo >= 1; colNo--) {
            const currCol = allColumns.item(colNo - 1);
            const currColNo = utils.getColumnNo(currCol);
            if (currColNo > columnsQty) {
                removeColumn(currColNo);
                removedColQty++;
            }
            if (removedColQty >= excessColQty) break;
        }
    }
}

function addSeparator(sepNo) {
    if (document.getElementById(`sep-top-${sepNo}`)) return;

    const separator = document.createElement('div');
    separator.id = `sep-top-${sepNo}`;
    separator.classList.add('separator', 'sep-v', 'sep-top');
    separator.style.gridArea = `sv${sepNo}`;
    legend.appendChild(separator);
}

function addSeparators() {
    const columnsQty = param.width.value;
    const sepSpacing = param.separatorSpacing.value;

    const separatorQty = Math.floor((columnsQty - 1) / sepSpacing);
    for (let sepNo = 1; sepNo <= separatorQty; sepNo++) {
        addSeparator(sepNo);
    }
}

function removeSeparator(sepNo) {
    let separator = document.getElementById(`sep-top-${sepNo}`);
    if (!separator) return;
    
    separator.parentElement.removeChild(separator);
}

function updateSeparators() {
    const columnsQty = param.width.value;
    const sepSpacing = param.separatorSpacing.value;
    const separatorQty = Math.floor((columnsQty - 1) / sepSpacing);

    addSeparators();

    const allSeparators = document.querySelectorAll('.sep-top');
    let excessSepQty = allSeparators.length - separatorQty;
    let removedSepQty = 0;
    if (excessSepQty > 0) {
        for (let sepNo = allSeparators.length; sepNo >= 1; sepNo--) {
            const currSep = allSeparators.item(sepNo - 1);
            const currSepNo = utils.getSeparatorNo(currSep);
            if (currSepNo > separatorQty) {
                removeSeparator(currSepNo);
                removedSepQty++;
            }
            if (removedSepQty >= excessSepQty) break;
        }
    }
}