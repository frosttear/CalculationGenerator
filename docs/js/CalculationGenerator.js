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
        // For * and /, always use 2-9 regardless of the specified range
        const getRandomNumber = (min, max, forceSmallNumbers = false) => {
            if (forceSmallNumbers) {
                // Always return a number between 2-9 for * and / operations
                return Math.floor(Math.random() * 8) + 2; // 2-9 inclusive
            }
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        for (let c = 0; c < dayCount; c++) {
            const dayGroup = [];
            let equationCountInDay = 0;

            while (equationCountInDay < dailyNum) {
                let number1, number2, number3, operator, operator2, result;
                let lbracket = '', rbracket = '';
                let isValid = false;
                let globalAttempts = 0;

                while (!isValid && globalAttempts < 1000) {
                    globalAttempts++;
                    isValid = true;
                    lbracket = '';
                    rbracket = '';

                    if (equationCountInDay < oneOperatorEquationNum) {
                        // One-operator equation
                        operator = operators[Math.floor(Math.random() * operators.length)];
                        operator2 = '';
                        number3 = '';

                        if (operator === '/') {
                            // For division, use either:
                            // 1. Two numbers between 2-9, or
                            // 2. A two-digit number (10-99) divided by a one-digit number (2-9)
                            if (Math.random() < 0.5) {
                                // Option 1: Two single-digit numbers (2-9)
                                let divisor = getRandomNumber(0, 0, true); // 2-9
                                let quotient = getRandomNumber(0, 0, true); // 2-9
                                number1 = quotient * divisor;
                                number2 = divisor;
                            } else {
                                // Option 2: Two-digit dividend, one-digit divisor
                                number2 = getRandomNumber(0, 0, true); // 2-9
                                let maxQuotient = Math.min(99, Math.floor(rangeEnd / number2));
                                if (maxQuotient < 2) maxQuotient = 2;
                                const quotient = getRandomNumber(2, maxQuotient);
                                number1 = quotient * number2;
                                
                                // Ensure the dividend is a two-digit number (10-99)
                                if (number1 < 10) {
                                    // If too small, adjust the quotient to make it two digits
                                    const minQuotient = Math.ceil(10 / number2);
                                    if (minQuotient <= maxQuotient) {
                                        const quotient = getRandomNumber(minQuotient, maxQuotient);
                                        number1 = quotient * number2;
                                    } else {
                                        // Fallback to single-digit division if can't make two-digit dividend
                                        number2 = getRandomNumber(0, 0, true);
                                        const quotient = getRandomNumber(0, 0, true);
                                        number1 = quotient * number2;
                                    }
                                }
                            }
                        } else if (operator === '*') {
                            // For multiplication, use either:
                            // 1. Two numbers between 2-9, or
                            // 2. A two-digit number (10-99) and a one-digit number (2-9)
                            if (Math.random() < 0.5) {
                                // Option 1: Two single-digit numbers (2-9)
                                number1 = getRandomNumber(0, 0, true); // 2-9
                                number2 = getRandomNumber(0, 0, true); // 2-9
                            } else {
                                // Option 2: Two-digit × one-digit
                                number1 = getRandomNumber(10, 99); // 10-99
                                number2 = getRandomNumber(0, 0, true); // 2-9
                                // Ensure the product is within range
                                if (number1 * number2 > rangeEnd) {
                                    // If product is too large, reduce the two-digit number
                                    number1 = Math.min(99, Math.floor(rangeEnd / number2));
                                    if (number1 < 10) {
                                        // If still too large, fall back to single-digit multiplication
                                        number1 = getRandomNumber(0, 0, true);
                                    }
                                }
                            }
                        } else {
                            number1 = getRandomNumber(rangeStart, rangeEnd);
                            number2 = getRandomNumber(rangeStart, rangeEnd);
                        }
                        
                        // For multiplication and division, we've already ensured valid results with 2-9
                        // Only validate range for other operations
                        result = this.calculateResult(number1, number2, operator);
                        if (operator === '+' || operator === '-') {
                            if (result < rangeStart || result > rangeEnd || !Number.isInteger(result)) {
                                isValid = false;
                                continue;
                            }
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

                            if (operator === '/') {
                                // For division, always use numbers 2-9
                                let divisor = getRandomNumber(0, 0, true); // 2-9
                                let quotient = getRandomNumber(0, 0, true); // 2-9
                                number1 = quotient * divisor;
                                number2 = divisor;
                            } else {
                                number1 = getRandomNumber(rangeStart, rangeEnd);
                                number2 = getRandomNumber(rangeStart, rangeEnd);
                            }

                            if (op2IsDiv) {
                                let divisor = getRandomNumber(0, 0, true); // 2-9
                                let quotient = getRandomNumber(0, 0, true); // 2-9
                                if (op1IsDiv) {
                                    // If both operators are division, use the same divisor for both
                                    number3 = divisor;
                                } else {
                                    // If only the second operator is division, set up the numbers accordingly
                                    number3 = divisor;
                                    number2 = quotient * divisor;
                                }
                            } else {
                                number3 = getRandomNumber(rangeStart, rangeEnd);
                            }

                        } else if (operator === '*' || operator2 === '*') {
                            // For two-operator equations with multiplication, allow two-digit by one-digit
                            const useTwoDigit = Math.random() < 0.5;
                            
                            if (useTwoDigit) {
                                // Generate a two-digit number (10-99) and a one-digit number (2-9)
                                number1 = getRandomNumber(10, 99);
                                number2 = getRandomNumber(0, 0, true); // 2-9
                                number3 = getRandomNumber(1, 9); // For the other operator
                                
                                // Ensure the multiplication result is within range
                                if (number1 * number2 > rangeEnd) {
                                    number1 = Math.min(99, Math.floor(rangeEnd / number2));
                                    if (number1 < 10) number1 = 10; // Ensure it's still two digits
                                }
                            } else {
                                // Original logic for single-digit multiplications
                                let maxFactor = Math.floor(Math.pow(rangeEnd, 1/3));
                                if (maxFactor < 1) maxFactor = 1;
                                number1 = getRandomNumber(rangeStart, maxFactor);
                                number2 = getRandomNumber(rangeStart, maxFactor);
                                number3 = getRandomNumber(rangeStart, maxFactor);
                            }

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

                // If we exhausted attempts without finding a valid equation, throw an error
                if (!isValid) {
                    // Create error object with data for localization
                    const error = new Error('EQUATION_GENERATION_FAILED');
                    error.operators = operators;
                    error.rangeStart = rangeStart;
                    error.rangeEnd = rangeEnd;
                    throw error;
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