import * as eq from './nEquationSolver.js';

const cssUnits = ['px', 'pt', 'cm', 'mm', 'in', 'pc'];

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
        sepNo = {no1: sepNo1, no2: sepNo2};
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