import * as config from './nConfig.js';
import * as utils from './nUtils.js';

const param = config.settings;
export const legend = document.getElementById('legend-side');



function generateSideLegendTemplateStrings() {
    const rowsQty = param.height.value;
    const legendWidth = param.sideLegendWidth.value;
    const cellSize = param.cellSize.value;
    const cellSizeReduced = param.cellSizeReduced.value;
    const sepSpacing = param.separatorSpacing.value;

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
            currentRowWidth = currentRowWidth.concat(`max-content `);
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

function generateSideLegendAreasString() {
    const rowsQty = param.height.value;
    const sepSpacing = param.separatorSpacing.value;

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

export function update() {
    //const heightSetting = param.height;

    updateAreas();
    updateTemplate();
    //addRow(heightSetting.value);
    updateRows();
    //addSeparators();
    updateSeparators();
}

export function populateLegend() {
    let rowsStyleString = generateSideLegendTemplateStrings().row;
    let templateAreasString = generateSideLegendAreasString();

    legend.style.gridTemplateRows = rowsStyleString;
    legend.style.gridTemplateAreas = templateAreasString;

    addRows();
    addSeparators();
}

function updateAreas() {
    legend.style.gridTemplateAreas = generateSideLegendAreasString();
}

function updateTemplate() {
    legend.style.gridTemplateRows = generateSideLegendTemplateStrings().row;
}

function addRow(rowNo) {
    if (document.getElementById(`row${rowNo}`)) return;

    const columnsStyleString = generateSideLegendTemplateStrings().col;
    const gridWidth = param.sideLegendWidth.value;

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
    legend.appendChild(row);

}

function addRows() {
    const rowsQty = param.height.value;

    for (let rowNo = 1; rowNo <= rowsQty; rowNo++) {
        addRow(rowNo);
    }
}

function removeRow(rowNo) {
    let row = document.getElementById(`row${rowNo}`);
    if (!row) return;

    row.parentElement.removeChild(row);
}

function updateRows() {
    const rowsQty = param.height.value;

    //add missing rows
    addRows();

    //remove excess rows
    const allRows = document.querySelectorAll('.legend-row');
    let excessRowQty = allRows.length - rowsQty;
    let removedRowQty = 0;
    if (excessRowQty > 0) {
        for (let rowNo = allRows.length; rowNo >= 1; rowNo--) {
            const currRow = allRows.item(rowNo - 1);
            const currRowNo = utils.getRowNo(currRow);
            if (currRowNo > rowsQty) {
                removeRow(currRowNo);
                removedRowQty++;
            }
            if (removedRowQty >= excessRowQty) break;
        }
    }
}

function addSeparator(sepNo) {
    if (document.getElementById(`sep-side-${sepNo}`)) return;

    const separator = document.createElement('div');
    separator.id = `sep-side-${sepNo}`;
    separator.classList.add('separator', 'sep-h', 'sep-side');
    separator.style.gridArea = `sh${sepNo}`;
    legend.appendChild(separator);
}

function addSeparators() {
    const rowsQty = param.height.value;
    const sepSpacing = param.separatorSpacing.value;

    const separatorQty = Math.floor((rowsQty - 1) / sepSpacing);
    for (let sepNo = 1; sepNo <= separatorQty; sepNo++) {
        addSeparator(sepNo);
    }
}

function removeSeparator(sepNo) {
    let separator = document.getElementById(`sep-side-${sepNo}`);
    if (!separator) return;

    separator.parentElement.removeChild(separator);
}

function updateSeparators() {
    const rowsQty = param.height.value;
    const sepSpacing = param.separatorSpacing.value;
    const separatorQty = Math.floor((rowsQty - 1) / sepSpacing);

    addSeparators();

    const allSeparators = document.querySelectorAll('.sep-side');
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