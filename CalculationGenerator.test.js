const CalculationGenerator = require('./docs/js/CalculationGenerator');

describe('CalculationGenerator', () => {
    describe('calculateResult', () => {
        test('should add two numbers correctly', () => {
            expect(CalculationGenerator.calculateResult(5, 3, '+')).toBe(8);
        });

        test('should subtract two numbers correctly', () => {
            expect(CalculationGenerator.calculateResult(10, 4, '-')).toBe(6);
        });

        test('should multiply two numbers correctly', () => {
            expect(CalculationGenerator.calculateResult(3, 4, '*')).toBe(12);
        });

        test('should divide two numbers correctly', () => {
            expect(CalculationGenerator.calculateResult(20, 5, '/')).toBe(4);
        });
    });

    describe('generateEquations', () => {
        const options = {
            rangeStart: 0,
            rangeEnd: 100,
            dayCount: 1,
            rowsPerDay: 10,
            colsPerDay: 10,
            operators: ['+', '-', '*', '/'],
            dailyTwoOperatorsNum: 5
        };

        test('should generate the correct number of equation groups', () => {
            const equationGroups = CalculationGenerator.generateEquations(options);
            expect(equationGroups).toHaveLength(options.dayCount);
        });

        test('should generate the correct number of equations per day', () => {
            const equationGroups = CalculationGenerator.generateEquations(options);
            const totalEquations = equationGroups[0].flat().length;
            expect(totalEquations).toBe(options.rowsPerDay * options.colsPerDay);
        });

        test('should generate two-digit by one-digit multiplications (ignoring range for multiplication)', () => {
            const testOptions = {
                ...options,
                operators: ['*'],
                rowsPerDay: 20,
                colsPerDay: 5,
                rangeEnd: 200 // Increase range to allow two-digit by one-digit multiplications
            };
            
            // Generate a larger set to ensure we find two-digit by one-digit multiplications
            const equationGroups = CalculationGenerator.generateEquations(testOptions);
            let foundTwoDigitByOneDigit = false;
            
            equationGroups[0].forEach(row => {
                row.forEach(equation => {
                    const isTwoDigitByOneDigit = 
                        (equation.number1 >= 10 && equation.number1 <= 99 && equation.number2 >= 2 && equation.number2 <= 9) ||
                        (equation.number2 >= 10 && equation.number2 <= 99 && equation.number1 >= 2 && equation.number1 <= 9);
                    
                    if (isTwoDigitByOneDigit) {
                        foundTwoDigitByOneDigit = true;
                    }
                });
            });
            
            // With 100 equations, we should find at least some two-digit by one-digit multiplications
            expect(foundTwoDigitByOneDigit).toBe(true);
        });

        test('should generate two-digit by one-digit divisions (using 2-9 for divisors)', () => {
            const testOptions = {
                ...options,
                operators: ['/'],
                rowsPerDay: 1,
                colsPerDay: 1
            };
            
            // Run multiple times to increase chance of hitting two-digit by one-digit
            for (let i = 0; i < 10; i++) {
                const equationGroups = CalculationGenerator.generateEquations(testOptions);
                const equation = equationGroups[0][0][0];
                const isTwoDigitByOneDigit = 
                    equation.number1 >= 10 && 
                    equation.number1 <= 99 && 
                    equation.number2 >= 2 && 
                    equation.number2 <= 9 &&
                    equation.number1 % equation.number2 === 0;
                
                if (isTwoDigitByOneDigit) {
                    // If we found at least one two-digit by one-digit division, the test passes
                    expect(true).toBe(true);
                    return;
                }
            }
            
            // If we didn't find any after multiple attempts, the test fails
            expect(false).toBe(true);
        });

        test('should handle two-operator equations with two-digit by one-digit operations (special handling for * and /)', () => {
            const testOptions = {
                ...options,
                operators: ['+', '*'],
                rowsPerDay: 1,
                colsPerDay: 1,
                dailyTwoOperatorsNum: 1,
                rangeEnd: 200 // Increase range to allow two-digit by one-digit multiplications
            };
            
            // Run multiple times to increase chance of hitting two-digit by one-digit
            for (let i = 0; i < 20; i++) { // Increased attempts to 20
                const equationGroups = CalculationGenerator.generateEquations(testOptions);
                const equation = equationGroups[0][0][0];
                
                // Check if either operation is a two-digit by one-digit multiplication
                const isTwoDigitByOneDigit = 
                    (equation.operator === '*' && 
                     ((equation.number1 >= 10 && equation.number1 <= 99 && equation.number2 >= 2 && equation.number2 <= 9) ||
                      (equation.number2 >= 10 && equation.number2 <= 99 && equation.number1 >= 2 && equation.number1 <= 9))) ||
                    (equation.operator2 === '*' && 
                     ((equation.number2 >= 10 && equation.number2 <= 99 && equation.number3 >= 2 && equation.number3 <= 9) ||
                      (equation.number3 >= 10 && equation.number3 <= 99 && equation.number2 >= 2 && equation.number2 <= 9)));
                
                if (isTwoDigitByOneDigit) {
                    // If we found at least one two-digit by one-digit operation, the test passes
                    expect(true).toBe(true);
                    return;
                }
            }
            
            // If we didn't find any after multiple attempts, the test fails with a helpful message
            expect('No two-digit by one-digit operation found in two-operator equations after multiple attempts').toBe('Found');
        });
    });
});