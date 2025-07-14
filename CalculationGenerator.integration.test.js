const CalculationGenerator = require('./docs/js/CalculationGenerator');

describe('CalculationGenerator Integration Tests', () => {
    const testOptions = {
        rangeStart: 1,
        rangeEnd: 100,
        dayCount: 1,
        dailyNum: 50, // Generate a good number of equations to test distribution
        dailyTwoOperatorsNum: 25 // Half will be two-operator equations
    };

    test('should generate two-operator equations with mixed precedence when possible', () => {
        const options = { ...testOptions, operators: ['+', '-', '*', '/'] };
        const equationGroups = CalculationGenerator.generateEquations(options);
        const allEquations = equationGroups[0].flat();

        const twoOpEquations = allEquations.filter(eq => eq.number3 !== '');

        // Assert that a significant portion of two-operator equations have mixed precedence
        // We can't guarantee 100% due to randomness, but it should be high.
        let mixedPrecedenceCount = 0;
        twoOpEquations.forEach(eq => {
            const op1Precedence = CalculationGenerator.precedence[eq.operator];
            const op2Precedence = CalculationGenerator.precedence[eq.operator2];
            if (op1Precedence !== op2Precedence) {
                mixedPrecedenceCount++;
            }
        });

        // Expect at least 80% of two-operator equations to have mixed precedence
        // This threshold can be adjusted based on desired strictness and generation complexity.
        expect(mixedPrecedenceCount / twoOpEquations.length).toBeGreaterThanOrEqual(0.8);
    });

    test('should ensure all intermediate and final results are within range and are integers', () => {
        const options = { ...testOptions, operators: ['+', '-', '*', '/'], rangeStart: 1, rangeEnd: 50 };
        const equationGroups = CalculationGenerator.generateEquations(options);
        const allEquations = equationGroups[0].flat();

        allEquations.forEach(eq => {
            // Test final result
            expect(eq.result).toBeGreaterThanOrEqual(options.rangeStart);
            expect(eq.result).toBeLessThanOrEqual(options.rangeEnd);
            expect(Number.isInteger(eq.result)).toBe(true);

            // Test intermediate results for two-operator equations
            if (eq.number3 !== '') {
                let intermediateResult;
                if (eq.lbracket === ' ( ') { // (num1 op1 num2) op2 num3
                    intermediateResult = CalculationGenerator.calculateResult(eq.number1, eq.number2, eq.operator);
                } else if (CalculationGenerator.precedence[eq.operator] < CalculationGenerator.precedence[eq.operator2]) { // num1 op1 (num2 op2 num3)
                    intermediateResult = CalculationGenerator.calculateResult(eq.number2, eq.number3, eq.operator2);
                } else { // (num1 op1 num2) op2 num3 (standard precedence)
                    intermediateResult = CalculationGenerator.calculateResult(eq.number1, eq.number2, eq.operator);
                }

                expect(intermediateResult).toBeGreaterThanOrEqual(options.rangeStart);
                expect(intermediateResult).toBeLessThanOrEqual(options.rangeEnd);
                expect(Number.isInteger(intermediateResult)).toBe(true);
            }
        });
    });
});