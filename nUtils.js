export function getCSSVariable(varName) {
    let variable = getComputedStyle(document.documentElement).getPropertyValue(varName);
    variable = variable.replaceAll(' ', '');
    return variable;
}

export function getColumnNo(cellDiv) {
    const id = cellDiv.id;
    const idSplit = id.split('-');
    const colNo = parseInt(idSplit[0].match(/\d/g).join(''));
    return colNo;
}

export function getRowNo(cellDiv) {
    const id = cellDiv.id;
    const idSplit = id.split('-');
    const rowNo = parseInt(idSplit[1].match(/\d/g).join(''));
    return rowNo;
}

export function evaluateCSSVariable(varName) {
    let variable = getComputedStyle(document.documentElement).getPropertyValue(varName);
    debugger;
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
    //calc(calc(10px + 5px) * calc(2 - calc(6/2)))
    let calcOccurences = (calcExpression.match(/calc/g) || []).length;
    //console.log(calcOccurences);

    if (calcOccurences == 0) {

    }
}



