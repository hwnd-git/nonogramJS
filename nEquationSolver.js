const equationsOrder = ['*', '/', '+', '-'];

export function solveChainedEquation(equationString, equationId) {

    //10 + ---5*2-6 /2* 2+1

    let equationsCountData = countEquations(equationString);

    equationsOrder.forEach(equationSign => {
        // if (equationsCountData[equationSign] > 0) {
        //     do {
        //         const equationParts = equationString.split(equationSign);
        //         console.log(equationParts);
        //     } while (equationsCountData[equationSign] > 0);
        // } 

        while (equationsCountData[equationSign] > 0) {
            const equationParts = equationString.split(equationSign);
            console.log(equationParts);

            let leftPart = equationParts[0];
            let rightPart = equationParts[1];

            debugger;
            return false;
        }


    });

}

function countEquations(equationString) {
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

    return { count: equationsCount, '*': multiplicationsCount, '/': divisionsCount, '+': additionsCount, '-': subtractionsCount };
}

function solveSingularEquation(equationString, equationType = '') {
    //6/--3
    //-6/-3

    if (equationType === '') equationType = determineEquationType(equationString);

    const equationSignOccurence = equationString.indexOf(equationType);

    const leftSide = parseFloat(solveMultipleMinuses(equationString.substring(0, equationSignOccurence)));
    const rightSide = parseFloat(solveMultipleMinuses(equationString.substring(equationSignOccurence + 1)));

    let result = '';

    //debugger;

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

function solveMultipleMinuses(multipleMinusesString, preceedingString) {
    const number = multipleMinusesString.replaceAll('-', '');
    const minuses = multipleMinusesString.replace(number, '');
    const numberOfMinuses = minuses.length;

    const preceedingChar = preceedingString.substring(preceedingString.length - 1);

    //+---5 => +   -5
    //+--5 -> +   5
    //1---5 => 1   -5
    //1--5 -> 1   +5
    //*---5 => *   -5
    //*--5 -> *   5 
    //--5 ->   5

    //debugger;

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
    //10+---5*2-6/2*-2+1
    equationString = equationString.replaceAll(' ', '');

    //const multipleMinusesExcluded = equationString.replaceAll(new RegExp('-{2,}', 'g'), '');
    const nonMinusEquationSigns = equationsOrder.filter(equationSign => equationSign !== '-');
    let minusesChainLocation = 0;
    let beforeMinusesString = '';
    let multipleMinusesString = '';
    let afterMinusesString = '';

    let checkedEquation = equationString;

    do {
        console.log('checked equation: ', checkedEquation);
        minusesChainLocation = checkedEquation.search(new RegExp('-{2,}', 'g'));
        if (minusesChainLocation >= 0) {
            afterMinusesString = checkedEquation.substring(minusesChainLocation);
            beforeMinusesString = checkedEquation.substring(0, minusesChainLocation);
            let equationSignLocations = nonMinusEquationSigns.map(equationSign => {
                return afterMinusesString.indexOf(equationSign);
            })
            equationSignLocations = equationSignLocations.filter(signLocation => signLocation >= 0);
            let firstEquationSignLocation = Math.min.apply(Math, equationSignLocations);
            multipleMinusesString = afterMinusesString.substring(0, firstEquationSignLocation);
            afterMinusesString = afterMinusesString.substring(firstEquationSignLocation);

            checkedEquation = beforeMinusesString + solveMultipleMinuses(multipleMinusesString, beforeMinusesString) + afterMinusesString;
        }

    } while (minusesChainLocation >= 0)

    //debugger;

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