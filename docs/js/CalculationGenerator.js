const CalculationGenerator = {
    precedence: { '+': 0, '-': 0, '*': 1, '/': 1 },

    generateEquations(options) {
        const {
            rangeStart, rangeEnd, dayCount, dailyNum, operators, dailyTwoOperatorsNum
        } = options;

        const oneOperatorEquationNum = dailyNum - dailyTwoOperatorsNum;

        const equationGroups = [];

        // Helper to generate a random number within a range
        const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

        for (let c = 0; c < dayCount; c++) {
            const dayGroup = [];
            let rowEquations = [];
            for (let i = 0; i < dailyNum; i++) {
                let number1, number2, number3, operator, operator2, result;
                let lbracket = '', rbracket = '';
                let isValid = false;

                while (!isValid) {
                    isValid = true;
                    lbracket = '';
                    rbracket = '';

                    if (i < oneOperatorEquationNum) {
                        operator = operators[Math.floor(Math.random() * operators.length)];
                        // One-operator equation
                        operator2 = '';
                        number3 = '';

                        if (operator === '/') {
                            // Generate for division: dividend / divisor = quotient
                            let quotient = getRandomNumber(rangeStart > 0 ? rangeStart : 1, rangeEnd);
                            let divisor = getRandomNumber(rangeStart > 0 ? rangeStart : 1, rangeEnd);
                            number1 = quotient * divisor;
                            number2 = divisor;

                            // Ensure numbers are within range and not zero
                            if (number1 > rangeEnd || number1 < rangeStart || number2 === 0 || number2 < rangeStart || number2 > rangeEnd) {
                                isValid = false;
                                continue;
                            }
                        } else if (operator === '*') {
                            // Generate for multiplication: limit numbers to avoid overflow
                            let maxFactor = Math.floor(Math.sqrt(rangeEnd)); // Heuristic to keep products in range
                            if (maxFactor < 1) maxFactor = 1;
                            number1 = getRandomNumber(rangeStart, maxFactor);
                            number2 = getRandomNumber(rangeStart, maxFactor);
                            if (number1 * number2 > rangeEnd || number1 * number2 < rangeStart) {
                                isValid = false;
                                continue;
                            }
                        } else {
                            // For + and -
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
                            // Ensure operators have different precedence
                            const firstOpIsLow = Math.random() < 0.5;
                            operator = firstOpIsLow ? lowPrecedenceOperators[Math.floor(Math.random() * lowPrecedenceOperators.length)] : highPrecedenceOperators[Math.floor(Math.random() * highPrecedenceOperators.length)];
                            operator2 = firstOpIsLow ? highPrecedenceOperators[Math.floor(Math.random() * highPrecedenceOperators.length)] : lowPrecedenceOperators[Math.floor(Math.random() * lowPrecedenceOperators.length)];
                        } else {
                            // Fallback if only one type of precedence is available
                            operator = operators[Math.floor(Math.random() * operators.length)];
                            operator2 = operators[Math.floor(Math.random() * operators.length)];
                        }

                        // Generate numbers based on operators to increase validity
                        if (operator === '/' || operator2 === '/') {
                            // Prioritize division generation
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
                                if (op1IsDiv) { // If first op is also div, number2 is already set
                                    number3 = divisor;
                                } else {
                                    number3 = divisor;
                                    number2 = quotient * divisor; // This might overwrite number2 if op1 is not div
                                    if (number2 > rangeEnd || number2 < rangeStart || number3 === 0 || number3 < rangeStart || number3 > rangeEnd) {
                                        isValid = false;
                                        continue;
                                    }
                                }
                            } else {
                                number3 = getRandomNumber(rangeStart, rangeEnd);
                            }

                        } else if (operator === '*' || operator2 === '*') {
                            // Prioritize multiplication generation
                            let maxFactor = Math.floor(Math.pow(rangeEnd, 1/3)); // For 3 numbers, cube root
                            if (maxFactor < 1) maxFactor = 1;

                            number1 = getRandomNumber(rangeStart, maxFactor);
                            number2 = getRandomNumber(rangeStart, maxFactor);
                            number3 = getRandomNumber(rangeStart, maxFactor);

                        } else {
                            // For + and -
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
                        
                        // Final validation for two-operator equations
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

                rowEquations.push({ lbracket, rbracket, number1, number2, number3, operator, operator2, result });
                if ((i + 1) % 5 == 0 || i == dailyNum - 1) {
                    dayGroup.push(rowEquations);
                    rowEquations = [];
                }
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