export function getCSSVariable(varName) {
    let variable = getComputedStyle(document.documentElement).getPropertyValue(varName);
    variable = variable.replaceAll(' ','');
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