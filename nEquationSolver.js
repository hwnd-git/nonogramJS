const equationsOrder = ['*', '/', '+', '-'];

export function solveBracketsEquation(equationString) {
    //(10 + 5)*(2-(6/2))
    //debugger;
    const firstClosedBracketIndex = equationString.indexOf(')');
    //let analyzedEquation = equationString

    console.log('Bracketed equation: ', equationString);

    if (firstClosedBracketIndex >= 0) {
        let leftPart = equationString.substring(0, firstClosedBracketIndex);
        let rightPart = equationString.substring(firstClosedBracketIndex + 1);
        leftPart = leftPart.split('(').splice(-1)[0];

        let newEquation = solveChainedEquation(leftPart) + rightPart;
        // analyzedEquation = newEquation;

        debugger;
        return solveBracketsEquation(newEquation);
    }
    //TODO: dodać obsługę nawiasu, w którym jest po prostu liczba, bez żadnego działania
}


export function solveChainedEquation(equationString, equationId) {
    
    equationString = normalizeEquation(equationString);

    let equationsCountData = countEquations(equationString);
    let analyzedEquation = equationString;
    let splittingEquationSigns = equationsOrder;


    equationsOrder.forEach(equationSign => {

        while (equationsCountData[equationSign] > 0) {
            console.log('solving equation: ', analyzedEquation);
            console.log('Equations left: ', equationsCountData.count);

            const equationParts = analyzedEquation.split(equationSign);
            console.log(equationParts, 'equation: ', equationSign);

            let leftPart = equationParts[0];
            let rightPart = equationParts[1];

            equationParts.splice(0, 2);

            splittingEquationSigns = splittingEquationSigns.filter(eqSign => eqSign !== equationSign);

            let leftLastEqIndex = getLastEquationIndex(leftPart, splittingEquationSigns);
            let rightFirstEqIndex = getFirstEquationIndex(rightPart, splittingEquationSigns);

            let leftEqSign = leftPart.charAt(leftLastEqIndex);
            if (leftEqSign === '-') {
                var leftNumber = leftPart.substring(leftLastEqIndex);
                leftPart = leftPart.substring(0, leftLastEqIndex);
            } else {
                var leftNumber = leftPart.substring(leftLastEqIndex + 1);
                leftPart = leftPart.substring(0, leftLastEqIndex + 1);
            }

            if (rightFirstEqIndex >= 0) {
                var rightNumber = rightPart.substring(0, rightFirstEqIndex);
                rightPart = rightPart.substring(rightFirstEqIndex);
            } else {
                rightNumber = rightPart;
                rightPart = '';
            }

            let newPartialEquation = leftPart + solveSingleEquation(leftNumber, rightNumber, equationSign) + rightPart

            equationParts.unshift(newPartialEquation);

            let newFullEquation = equationParts.join(equationSign);

            analyzedEquation = normalizeEquation(newFullEquation)
            equationsCountData = countEquations(analyzedEquation);
        }


    });

    return analyzedEquation;

}

function getLastEquationIndex(equationString, equationSigns = equationsOrder) {
    let eqSignsLocations = equationSigns.map(eqSign => equationString.lastIndexOf(eqSign));

    eqSignsLocations = eqSignsLocations.filter(signLocation => signLocation > 0);
    if (eqSignsLocations.length == 0) {
        return -1;
    } else {
        return Math.max.apply(Math, eqSignsLocations);
    }

    //let lastEqIndex = Math.max.apply(Math, eqSignsLocations);
    //return lastEqIndex;

    //TODO: co jeśli nie znajdzie żadnych znaków działań?
}

function getFirstEquationIndex(equationString, equationSigns = equationsOrder) {
    let eqSignsLocations = equationSigns.map(eqSign => equationString.indexOf(eqSign));
    //debugger;
    eqSignsLocations = eqSignsLocations.filter(signLocation => signLocation > 0);
    if (eqSignsLocations.length == 0) {
        return -1;
    } else {
        return Math.min.apply(Math, eqSignsLocations);
    }
}

function countEquations(equationString) {
    const removedAdditions = equationString.replaceAll('+', '');
    const additionsCount = equationString.length - removedAdditions.length;

    const removedSubtractions = equationString.replaceAll('-', '');
    let subtractionsCount = equationString.length - removedSubtractions.length;

    const removedMultiplications = equationString.replaceAll('*', '');
    const multiplicationsCount = equationString.length - removedMultiplications.length;

    const removedDivisions = equationString.replaceAll('/', '');
    const divisionsCount = equationString.length - removedDivisions.length;

    let equationsCount = additionsCount + subtractionsCount + multiplicationsCount + divisionsCount;

    if (equationsCount == 1 && equationString.indexOf('-') == 0) {
        equationsCount = 0;
        subtractionsCount = 0;
    }

    return { count: equationsCount, '*': multiplicationsCount, '/': divisionsCount, '+': additionsCount, '-': subtractionsCount };
}

function solveSingularEquation(equationString, equationType = '') {

    if (equationType === '') equationType = determineEquationType(equationString);

    const equationSignOccurence = equationString.indexOf(equationType);

    const leftSide = parseFloat(equationString.substring(0, equationSignOccurence));
    const rightSide = parseFloat(equationString.substring(equationSignOccurence + 1));

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

    console.log('SINGLE: ', equationString, ' = ', result);
    return result;
}

function solveSingleEquation(leftSide, rightSide, equationType) {
    let result = '';

    leftSide = parseFloat(leftSide);
    rightSide = parseFloat(rightSide);

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
    return result;
}

function solveMultipleMinuses(multipleMinusesString, preceedingString) {
    const number = multipleMinusesString.replaceAll('-', '');
    const minuses = multipleMinusesString.replace(number, '');
    const numberOfMinuses = minuses.length;

    const preceedingChar = preceedingString.substring(preceedingString.length - 1);

    switch (numberOfMinuses % 2) {
        case 0:
            let checkIfNumber = parseInt(preceedingChar);
            if (checkIfNumber) {
                return `+${number}`;
            } else {
                return number;
            }
        case 1:
            return `-${number}`;
    }
}

export function normalizeEquation(equationString) {
    //2+--18
    debugger;

    if (equationString.indexOf(' ') >= 0) equationString = equationString.replaceAll(' ', '');

    let checkedEquation = equationString;

    if (checkedEquation.search(new RegExp('-{2,}', 'g')) < 0) return equationString;

    const nonMinusEquationSigns = equationsOrder.filter(equationSign => equationSign !== '-');
    let beforeMinusesString = '';
    let multipleMinusesString = '';
    let afterMinusesString = '';
    let minusesChainLocation = checkedEquation.search(new RegExp('-{2,}', 'g'));

    do {
        console.log('normalizing equation: ', checkedEquation);
        //if (minusesChainLocation >= 0) {
        afterMinusesString = checkedEquation.substring(minusesChainLocation);
        beforeMinusesString = checkedEquation.substring(0, minusesChainLocation);

        let firstEquationSignLocation = getFirstEquationIndex(equationString, nonMinusEquationSigns);

        if (firstEquationSignLocation == -1) {
            multipleMinusesString = afterMinusesString;
            afterMinusesString = '';
        } else {
            multipleMinusesString = afterMinusesString.substring(0, firstEquationSignLocation);
            afterMinusesString = afterMinusesString.substring(firstEquationSignLocation);
        }

        checkedEquation = beforeMinusesString + solveMultipleMinuses(multipleMinusesString, beforeMinusesString) + afterMinusesString;
        minusesChainLocation = checkedEquation.search(new RegExp('-{2,}', 'g'));
        //}

    } while (minusesChainLocation >= 0)

    return checkedEquation;
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