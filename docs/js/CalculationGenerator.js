const CalculationGenerator = {
    precedence: { '+': 0, '-': 0, '*': 1, '/': 1 },

    generateEquations(options) {
        const {
            rangeStart, rangeEnd, dayCount, operators, dailyTwoOperatorsNum,
            rowsPerDay, colsPerDay
        } = options;

        const dailyNum = rowsPerDay * colsPerDay;
        const oneOperatorEquationNum = dailyNum - dailyTwoOperatorsNum;

        const equationGroups = [];

        // Helper to generate a random number within a range
        const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

        for (let c = 0; c < dayCount; c++) {
            const dayGroup = [];
            let equationCountInDay = 0;

            while (equationCountInDay < dailyNum) {
                let number1, number2, number3, operator, operator2, result;
                let lbracket = '', rbracket = '';
                let isValid = false;

                while (!isValid) {
                    isValid = true;
                    lbracket = '';
                    rbracket = '';

                    if (equationCountInDay < oneOperatorEquationNum) {
                        // One-operator equation
                        operator = operators[Math.floor(Math.random() * operators.length)];
                        operator2 = '';
                        number3 = '';

                        if (operator === '/') {
                            let quotient = getRandomNumber(rangeStart > 0 ? rangeStart : 1, rangeEnd);
                            let divisor = getRandomNumber(rangeStart > 0 ? rangeStart : 1, rangeEnd);
                            number1 = quotient * divisor;
                            number2 = divisor;

                            if (number1 > rangeEnd || number1 < rangeStart || number2 === 0 || number2 < rangeStart || number2 > rangeEnd) {
                                isValid = false;
                                continue;
                            }
                        } else if (operator === '*') {
                            let maxFactor = Math.floor(Math.sqrt(rangeEnd));
                            if (maxFactor < 1) maxFactor = 1;
                            number1 = getRandomNumber(rangeStart, maxFactor);
                            number2 = getRandomNumber(rangeStart, maxFactor);
                            if (number1 * number2 > rangeEnd || number1 * number2 < rangeStart) {
                                isValid = false;
                                continue;
                            }
                        } else {
                            number1 = getRandomNumber(rangeStart, rangeEnd);
                            number2 = getRandomNumber(rangeStart, rangeEnd);
                        }
                        
                        result = this.calculateResult(number1, number2, operator);
                        if (result < rangeStart || result > rangeEnd || !Number.isInteger(result)) {
                            isValid = false;
                            continue;
                        }

                    } else {
                        // Two-operator equation
                        const lowPrecedenceOperators = operators.filter(op => op === '+' || op === '-');
                        const highPrecedenceOperators = operators.filter(op => op === '*' || op === '/');

                        if (lowPrecedenceOperators.length > 0 && highPrecedenceOperators.length > 0) {
                            // Strictly ensure operators have different precedence
                            const op1Group = Math.random() < 0.5 ? lowPrecedenceOperators : highPrecedenceOperators;
                            const op2Group = (op1Group === lowPrecedenceOperators) ? highPrecedenceOperators : lowPrecedenceOperators;

                            operator = op1Group[Math.floor(Math.random() * op1Group.length)];
                            operator2 = op2Group[Math.floor(Math.random() * op2Group.length)];
                        } else {
                            // Fallback if only one type of precedence is available
                            operator = operators[Math.floor(Math.random() * operators.length)];
                            operator2 = operators[Math.floor(Math.random() * operators.length)];
                        }

                        if (operator === '/' || operator2 === '/') {
                            let op1IsDiv = (operator === '/');
                            let op2IsDiv = (operator2 === '/');

                            if (op1IsDiv) {
                                let quotient = getRandomNumber(rangeStart > 0 ? rangeStart : 1, rangeEnd);
                                let divisor = getRandomNumber(rangeStart > 0 ? rangeStart : 1, rangeEnd);
                                number1 = quotient * divisor;
                                number2 = divisor;
                                if (number1 > rangeEnd || number1 < rangeStart || number2 === 0 || number2 < rangeStart || number2 > rangeEnd) {
                                    isValid = false;
                                    continue;
                                }
                            } else {
                                number1 = getRandomNumber(rangeStart, rangeEnd);
                                number2 = getRandomNumber(rangeStart, rangeEnd);
                            }

                            if (op2IsDiv) {
                                let quotient = getRandomNumber(rangeStart > 0 ? rangeStart : 1, rangeEnd);
                                let divisor = getRandomNumber(rangeStart > 0 ? rangeStart : 1, rangeEnd);
                                if (op1IsDiv) {
                                    number3 = divisor;
                                } else {
                                    number3 = divisor;
                                    number2 = quotient * divisor;
                                    if (number2 > rangeEnd || number2 < rangeStart || number3 === 0 || number3 < rangeStart || number3 > rangeEnd) {
                                        isValid = false;
                                        continue;
                                    }
                                }
                            } else {
                                number3 = getRandomNumber(rangeStart, rangeEnd);
                            }

                        } else if (operator === '*' || operator2 === '*') {
                            let maxFactor = Math.floor(Math.pow(rangeEnd, 1/3));
                            if (maxFactor < 1) maxFactor = 1;

                            number1 = getRandomNumber(rangeStart, maxFactor);
                            number2 = getRandomNumber(rangeStart, maxFactor);
                            number3 = getRandomNumber(rangeStart, maxFactor);

                        } else {
                            number1 = getRandomNumber(rangeStart, rangeEnd);
                            number2 = getRandomNumber(rangeStart, rangeEnd);
                            number3 = getRandomNumber(rangeStart, rangeEnd);
                        }

                        const forceLeftToRight = Math.random() < 0.5;

                        let intermediateResult;
                        if (forceLeftToRight && this.precedence[operator] < this.precedence[operator2]) {
                            lbracket = ' ( ';
                            rbracket = ' ) ';
                            intermediateResult = this.calculateResult(number1, number2, operator);
                            if (intermediateResult < rangeStart || intermediateResult > rangeEnd || !Number.isInteger(intermediateResult)) { isValid = false; continue; }
                            result = this.calculateResult(intermediateResult, number3, operator2);
                        } else if (this.precedence[operator] < this.precedence[operator2]) {
                            intermediateResult = this.calculateResult(number2, number3, operator2);
                            if (intermediateResult < rangeStart || intermediateResult > rangeEnd || !Number.isInteger(intermediateResult)) { isValid = false; continue; }
                            result = this.calculateResult(number1, intermediateResult, operator);
                        } else {
                            intermediateResult = this.calculateResult(number1, number2, operator);
                            if (intermediateResult < rangeStart || intermediateResult > rangeEnd || !Number.isInteger(intermediateResult)) { isValid = false; continue; }
                            result = this.calculateResult(intermediateResult, number3, operator2);
                        }
                        
                        if (result < rangeStart || result > rangeEnd || !Number.isInteger(result) ||
                            (operator === '/' && (number2 === 0 || number1 % number2 !== 0)) ||
                            (operator2 === '/' && (number3 === 0 || intermediateResult % number3 !== 0 && !forceLeftToRight)) ||
                            (operator2 === '/' && (number3 === 0 || this.calculateResult(number2, number3, operator2) % number3 !== 0 && forceLeftToRight))
                        ) {
                            isValid = false;
                            continue;
                        }
                    }
                }

                // Add equation to the current row
                if (equationCountInDay % colsPerDay === 0) {
                    rowEquations = []; // Start a new row
                    dayGroup.push(rowEquations);
                }
                rowEquations.push({ lbracket, rbracket, number1, number2, number3, operator, operator2, result });
                equationCountInDay++;
            }
            equationGroups.push(dayGroup);
        }
        return equationGroups;
    },

    calculateResult(number1, number2, operator) {
        switch (operator) {
            case '+':
            case '\u002b':
                return number1 + number2;
            case '-':
            case '\u2212':
                return number1 - number2;
            case '*':
            case '\u00D7':
                return number1 * number2;
            case '/':
            case '\u00F7':
                return number1 / number2;
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CalculationGenerator;
}