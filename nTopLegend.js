import * as config from './nConfig.js';

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
    const widthSetting = param.width;
    
    updateAreas();
    updateTemplate();
    addColumn(widthSetting.value);
    addSeparators();
}

export function populateLegend() {
    const columnsQty = param.width.value;

    let columnsStyleString = generateTopLegendTemplateStrings().col;
    let templateAreasString = generateTopLegendAreasString();

    legend.style.gridTemplateColumns = columnsStyleString;
    legend.style.gridTemplateAreas = `${templateAreasString}`;

    for (let colNo = 1; colNo <= columnsQty; colNo++) {
        addColumn(colNo);
    }

    addSeparators();
}

function updateAreas() {
    legend.style.gridTemplateAreas = generateTopLegendAreasString();
}

function updateTemplate() {
    legend.style.gridTemplateColumns = generateTopLegendTemplateStrings().col;
}

function addColumn(colNo) {
    const rowsStyleString = generateTopLegendTemplateStrings().row;

    const gridHeight = param.topLegendHeight.value;

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
        legend.appendChild(col);
    }
}

function addSeparators() {
    const columnsQty = param.width.value;
    const sepSpacing = param.separatorSpacing.value;

    const separatorQty = (columnsQty - 1) / sepSpacing;
    for (let i = 1; i <= separatorQty; i++) {
        if (!document.getElementById(`sep-top-${i}`)) {
            const separator = document.createElement('div');
            separator.id = `sep-top-${i}`;
            separator.classList.add('separator', 'sep-v', 'sep-top');
            separator.style.gridArea = `sv${i}`;
            legend.appendChild(separator);
        }
    }
}