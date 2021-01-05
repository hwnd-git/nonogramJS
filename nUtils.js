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

export function solveBracketsEquation(equationString) {
    //(10 + 5)*(2-(6/2))
    equationString = equationString.replaceAll(' ', '');
    const firstClosedBracketIndex = equationString.indexOf(')');

    if (firstClosedBracketIndex < 0) {
        solveLayeredEquation('1+5*2-6/3')
    }
    //TODO: dodać obsługę nawiasu, w którym jest po prostu liczba, bez żadnego działania
    debugger;
}

export function solveLayeredEquation(equationString) {
    //1+5*2*-1-6/3
    //---3
    //1+-2
    //1/-2
    //-6/-3
    //6/--3
    //equationString = equationString.replaceAll(' ', '');

    let equationsCount = countEquations(equationString);

    debugger;
    if (equationsCount == 1) {
        return solveSingularEquation(equationString);
    } else if (equationsCount < 0) {
        return solveMultipleMinuses(equationString);
    } else {

        return solveLayeredEquation(equationString);
    }

    debugger;
}

function determineEquationType(simpleEquationString) {
    if (simpleEquationString.indexOf('+') >= 0) {
        return '+';
    } else if (simpleEquationString.indexOf('*') >= 0) {
        return '*';
    } else if (simpleEquationString.indexOf('/') >= 0) {
        return '/';
    } else {
        return '-';
    }
}

export function solveSingularEquation(equationString) {
    //6/--3
    //-6/-3
    const equationType = determineEquationType(equationString);

    const equationSignOccurence = equationString.indexOf(equationType);
    const leftSide = solveMultipleMinuses(equationString.substring(0, equationSignOccurence));
    const rightSide = solveMultipleMinuses(equationString.substring(equationSignOccurence + 1));

    let result = '';

    switch (equationType) {
        case '+':
            result = `${leftSide + rightSide}`;
            break;
        case '-':
            result = `${leftSide - rightSide}`;
            break;
        case '*':
            result = `${leftSide * rightSide}`;
            break;
        case '/':
            result = `${leftSide / rightSide}`;
            break;
    }

    debugger;
    return result;
}

export function solveMultipleMinuses(equationString) {
    const number = equationString.replaceAll('-', '');
    const minuses = equationString.replace(number, '');
    const numberOfMinuses = minuses.length;

    switch (numberOfMinuses % 2) {
        case 0:
            return number;
        case 1:
            return `-${number}`;
    }
}

function countEquationCharacters(equationString) {
    const removedAdditions = equationString.replaceAll('+', '');
    const additionsCount = equationString.length - removedAdditions.length;

    const removedSubtractions = equationString.replaceAll('-', '');
    const subtractionsCount = equationString.length - removedSubtractions.length;

    const removedMultiplications = equationString.replaceAll('*', '');
    const multiplicationsCount = equationString.length - removedMultiplications.length;

    const removedDivisions = equationString.replaceAll('/', '');
    const divisionsCount = equationString.length - removedDivisions.length;

    const nonSubtractionSignCount = additionsCount + multiplicationsCount + divisionsCount;
    //const nonSubstractionSigns = [additionsCount, multiplicationsCount, divisionsCount];

    debugger;

    if (nonSubtractionSignCount > 1) {
        // return {
        //     quantity: nonSubtractionSignCount,
        //     type: undefined
        // }
        return nonSubtractionSignCount;
    } else if (nonSubtractionSignCount == 1) {
        // let equationType = additionsCount > 0 ? '+' : multiplicationsCount > 0 ? '*' : '/';
        // return {
        //     quantity: 1,
        //     type: equationType
        // }
        return 1;
    } else {
        if (subtractionsCount > 1) {
            // return {
            //     quantity: -1,
            //     type: undefined
            // };
            return -1;
        } else if (subtractionsCount == 0) {
            // return {
            //     quantity: 0,
            //     type: undefined
            // };
            return 0;
        } else {
            // return {
            //     quantity: 1,
            //     type: '-'
            // };
            return 1;
        }
    }
}

export function countEquations(equationString) {
    const multipleMinusesExcluded = equationString.replaceAll(new RegExp('-{2,}', 'g'), '');


    const removedAdditions = multipleMinusesExcluded.replaceAll('+', '');
    const additionsCount = multipleMinusesExcluded.length - removedAdditions.length;

    const removedSubtractions = multipleMinusesExcluded.replaceAll('-', '');
    const subtractionsCount = multipleMinusesExcluded.length - removedSubtractions.length;

    const removedMultiplications = multipleMinusesExcluded.replaceAll('*', '');
    const multiplicationsCount = multipleMinusesExcluded.length - removedMultiplications.length;

    const removedDivisions = multipleMinusesExcluded.replaceAll('/', '');
    const divisionsCount = multipleMinusesExcluded.length - removedDivisions.length;

    let equationsCount = additionsCount + subtractionsCount + multiplicationsCount + divisionsCount;

    if (equationsCount == 0) {
        if (multipleMinusesExcluded.length < equationString.length) {
            equationsCount = 1;
        }
    }

    return equationsCount;
}