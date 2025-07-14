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
            dailyNum: 10,
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
            expect(totalEquations).toBe(options.dailyNum);
        });
    });
});