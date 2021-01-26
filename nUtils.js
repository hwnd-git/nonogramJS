import * as eq from './nEquationSolver.js';

//TODO: not all functions here are used -> perform cleanup

const cssUnits = ['px', 'pt', 'cm', 'mm', 'in', 'pc'];
const mainContainer = document.getElementById('main-container');

export function getCSSVariable(varName, sourceElement = document.documentElement) {
    let variable = getComputedStyle(sourceElement).getPropertyValue(varName);
    variable = variable.replaceAll(' ', '');
    //debugger;
    //return variable;
    if (variable.indexOf('calc') >= 0) {
        return calcEval(variable);
    } else {
        return variable;
    }
}

export function lockAbsolutePosition(/** @type {HTMLElement} */ element) {
    let bounds = element.getBoundingClientRect();
    console.log(bounds)

    resetStyles(element);
    
    element.style.position = 'absolute';

    element.style.top = bounds.top + "px";
    // element.style.bottom = bounds.bottom + "px";
    element.style.left = bounds.left + "px";
    // element.style.right = bounds.right + "px";

    
    // element.style.top = bounds.top + "px";
    // element.style.bottom = bounds.bottom + "px";
    // element.style.left = bounds.left + "px";
    // element.style.right = bounds.right + "px";

    // bounds = element.getBoundingClientRect();
    // console.log(bounds)

    // element.style.width = '500px'
    // element.style.height = '500px'

    // element.style.left = '100px'
    // element.style.right = '0px'
    // element.style.top = '100px'
    // element.style.bottom = '0px'

    
    
    element.style.width = bounds.width + "px";
    element.style.height = bounds.height + "px";
    

    document.body.appendChild(element);
}

export function setCSSVariable(varName, value, sourceElement = document.documentElement) {
    sourceElement.style.setProperty(varName, value);
}

export function getColumnNo(cellOrCol) {
    let id = cellOrCol.id;
    let colNo = undefined;

    if (id.indexOf('col') >= 0) {
        id = id.replaceAll('col', '');
        colNo = parseInt(id);
    } else {
        const idSplit = id.split('-');
        colNo = parseInt(idSplit[0].match(/\d/g).join(''));
    }

    return colNo;
}

export function getRowNo(cellOrRow) {
    let id = cellOrRow.id;
    let rowNo = undefined;

    if (id.indexOf('row') >= 0) {
        id = id.replaceAll('row', '');
        rowNo = parseInt(id);
    } else {
        const idSplit = id.split('-');
        rowNo = parseInt(idSplit[1].match(/\d/g).join(''));
    }

    return rowNo;
}

export function getSeparatorNo(separatorDiv) {
    let id = separatorDiv.id;
    let idSplit = id.split('-');

    //ifs here
    let sepNo = undefined;
    if (idSplit.length > 3) {   //gameGrid V separator (has more id segments)
        let sepNo2 = parseInt(idSplit.splice(-1)[0]);    //splice odcina i zwraca ostatni element tablicy (tablica zostaje odcięta)
        let sepNo1 = parseInt(idSplit.splice(-1)[0]);
        sepNo = { no1: sepNo1, no2: sepNo2 };
    } else {
        sepNo = parseInt(idSplit.splice(-1)[0]);
    }

    return sepNo;
}

export function evaluateCSSVariable(varName) {
    let variable = getComputedStyle(document.documentElement).getPropertyValue(varName);
    //debugger;
    variable = variable.replaceAll(' ', '');
    // const numeric = parseInt(variable.match(/\d/g).join(''));
    const numeric = variable.match(/\d/g).join('');
    const unit = variable.replace(numeric, '');
    return {
        value: numeric,
        unit: unit
    };
}

export function calcEval(calcExpression) {
    calcExpression = calcExpression.replaceAll('calc', '');
    let cssUnit = getResultingCssUnit(calcExpression);
    calcExpression = removeCSSUnits(calcExpression);

    return eq.solveBracketsEquation(calcExpression) + cssUnit;
}

function removeCSSUnits(expression) {
    cssUnits.forEach(cssUnit => expression = expression.replaceAll(cssUnit, ''));
    return expression;
}

function getResultingCssUnit(expression) {
    let occurences = cssUnits.map(cssUnit => {
        let unitStrLen = cssUnit.length;
        let expressionWithoutUnits = expression.replaceAll(cssUnit, '');

        let lengthDifference = expression.length - expressionWithoutUnits.length;
        return lengthDifference / unitStrLen;
    })
    let maxOccurence = Math.max.apply(Math, occurences);

    let unitOccurences = new Map()
    for (let i = 0; i < cssUnits.length; i++) {
        if (occurences[i] == maxOccurence) unitOccurences.set(cssUnits[i], occurences[i])
    }

    return unitOccurences.keys().next().value;
}

export function changeHeightOfElement(element, changeValue) {
    element.style.height = element.getBoundingClientRect().height + changeValue + "px";
}

export function setHeightOfElement(element, setValue, includeMainPadding = true) {
    if (includeMainPadding) {
        let topPadding = window.getComputedStyle(mainContainer).getPropertyValue('padding-top');
        topPadding = parseInt(topPadding);
        element.style.height = setValue - topPadding + "px";
    } else {
        element.style.height = setValue + "px";
    }

}

export function changeWidthOfElement(element, changeValue) {
    element.style.width = element.getBoundingClientRect().width + changeValue + "px";
}

export function setWidthOfElement(element, setValue, includeMainPadding = true) {
    if (includeMainPadding) {
        let leftPadding = window.getComputedStyle(mainContainer).getPropertyValue('padding-left');
        leftPadding = parseInt(leftPadding);
        element.style.width = setValue - leftPadding + "px";
    } else {
        element.style.width = setValue + "px";
    }
}

export function getWidth(element) {
    const bounds = element.getBoundingClientRect();
    return bounds.width;
}

export function getHeight(element) {
    const bounds = element.getBoundingClientRect();
    return bounds.height;
}

export function resetStyles(element) {
    element.removeAttribute('style');
}

export function evaluateStageSize(legendSize, stageCellsQty) {
    const twoWrappersThickness = 2 * parseInt(getCSSVariable('--wrapper-border'));
    const cellSize = parseInt(getCSSVariable('--cell-size'));
    const cellBorder = parseInt(getCSSVariable('--cell-border'));

    const legendWidth = cellSize + (cellSize - cellBorder) * (legendSize - 1);
    
    const separatorSpacing = parseInt(getCSSVariable('--separator-spacing'));
    const separatorQty = Math.floor((stageCellsQty - 1) / separatorSpacing);
    const separatorWidth = parseInt(getCSSVariable('--separator-width'));
    const totalSeparatorWidth = separatorQty * separatorWidth;

    const separatedGroupFullWidth = cellSize + (cellSize - cellBorder) * (separatorSpacing - 1); 
    const fullGroupsQty = parseInt(stageCellsQty / separatorSpacing);
    const totalGroupsWidth = separatedGroupFullWidth * fullGroupsQty;

    const partialGroupCellsQty = stageCellsQty % separatorSpacing;
    const partialGroupWidth = cellSize * partialGroupCellsQty - Math.max((partialGroupCellsQty - 1), 0) * cellBorder;

    const gameGridWidth = totalGroupsWidth + partialGroupWidth + totalSeparatorWidth;
    
    return gameGridWidth + legendWidth + twoWrappersThickness;
}

// export function calculateStageHeight(topLegendSize, stageRowsQty) {
//     const twoWrappersThickness = 2 * parseInt(getCSSVariable('--wrapper-border'));
//     const cellSize = parseInt(getCSSVariable('--cell-size'));
//     const cellBorder = parseInt(getCSSVariable('--cell-border'));

//     const legendHeight = cellSize + (cellSize - cellBorder) * (topLegendSize - 1);
    
//     const separatorSpacing = parseInt(getCSSVariable('--separator-spacing'));
//     const separatorQty = Math.floor((stageRowsQty - 1) / separatorSpacing);
//     const separatorWidth = parseInt(getCSSVariable('--separator-width'));
//     const totalSeparatorWidth = separatorQty * separatorWidth;

//     const separatedGroupFullWidth = cellSize + (cellSize - cellBorder) * (separatorSpacing - 1); 
//     const fullGroupsQty = parseInt(stageRowsQty / separatorSpacing);
//     const totalGroupsWidth = separatedGroupFullWidth * fullGroupsQty;

//     const partialGroupCellsQty = stageRowsQty % separatorSpacing;
//     const partialGroupWidth = cellSize * partialGroupCellsQty - Math.max((partialGroupCellsQty - 1), 0) * cellBorder;

//     const gameGridWidth = totalGroupsWidth + partialGroupWidth + totalSeparatorWidth;
    
//     return gameGridWidth + legendHeight + twoWrappersThickness;
// }