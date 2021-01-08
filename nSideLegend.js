import * as config from './nConfig.js';

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

export function populateSideLegend() {
    const rowsQty = param.height.value;

    let rowsStyleString = generateSideLegendTemplateStrings().row;
    let templateAreasString = generateSideLegendAreasString();

    const legendElement = document.getElementById('legend-side')
    legendElement.style.gridTemplateRows = rowsStyleString;
    legendElement.style.gridTemplateAreas = templateAreasString;

    for (let rowNo = 1; rowNo <= rowsQty; rowNo++) {
        addRow(rowNo);
    }

    addSeparators();
}

export function updateAreas() {
    const sideLegend = document.getElementById('legend-side');
    sideLegend.style.gridTemplateAreas = generateSideLegendAreasString();
}

export function updateTemplate() {
    const sideLegend = document.getElementById('legend-side');
    sideLegend.style.gridTemplateRows = generateSideLegendTemplateStrings().row;
}

export function addRow(rowNo) {
    const sideLegend = document.getElementById('legend-side');
    const columnsStyleString = generateSideLegendTemplateStrings().col;

    const gridWidth = param.sideLegendWidth.value;

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

export function addSeparators() {
    const rowsQty = param.height.value;
    const sepSpacing = param.separatorSpacing.value;
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