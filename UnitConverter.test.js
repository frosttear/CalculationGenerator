const UnitConverter = require('./docs/js/UnitConverter');

describe('UnitConverter', () => {
    const minVal = 1;
    const maxVal = 10000;

    describe('Length Units', () => {
        const unitsInMM = { '千米': 1000000, '米': 1000, '分米': 100, '厘米': 10, '毫米': 1 };
        const unitNames = ['千米', '米', '分米', '厘米', '毫米'];

        test('should correctly convert meters to millimeters', () => {
            const result = UnitConverter.generateResult(1, '米', new Set(['米']), unitsInMM, unitNames, minVal, maxVal, '毫米');
            expect(result.conversion).toEqual([{ value: 1000, unit: '毫米' }]);
        });

        test('should correctly convert centimeters to a compound result', () => {
            const result = UnitConverter.generateResult(13, '厘米', new Set(['厘米']), unitsInMM, unitNames, minVal, maxVal, '分米');
            expect(result.conversion).toEqual([{ value: 1, unit: '分米' }, { value: 3, unit: '厘米' }]);
        });

        test('should correctly convert decimeters to a compound result', () => {
            const result = UnitConverter.generateResult(349, '分米', new Set(['分米']), unitsInMM, unitNames, minVal, maxVal, '米');
            expect(result.conversion).toEqual([{ value: 34, unit: '米' }, { value: 9, unit: '分米' }]);
        });
    });

    describe('Weight Units', () => {
        const unitsInGrams = { '吨': 1000000, '千克': 1000, '斤': 500, '克': 1 };
        const unitNames = ['吨', '千克', '斤', '克'];

        test('should correctly convert kilograms to grams', () => {
            const result = UnitConverter.generateResult(1, '千克', new Set(['千克']), unitsInGrams, unitNames, minVal, maxVal, '克');
            expect(result.conversion).toEqual([{ value: 1000, unit: '克' }]);
        });

        test('should correctly convert tons to kilograms', () => {
            const result = UnitConverter.generateResult(1, '吨', new Set(['吨']), unitsInGrams, unitNames, minVal, maxVal, '千克');
            expect(result.conversion).toEqual([{ value: 1000, unit: '千克' }]);
        });
    });

    describe('RMB Units', () => {
        const unitsInFen = { '元': 100, '角': 10, '分': 1 };
        const unitNames = ['元', '角', '分'];

        test('should correctly convert yuan to fen', () => {
            const result = UnitConverter.generateResult(1, '元', new Set(['元']), unitsInFen, unitNames, minVal, maxVal, '分');
            expect(result.conversion).toEqual([{ value: 100, unit: '分' }]);
        });

        test('should correctly convert jiao to fen', () => {
            const result = UnitConverter.generateResult(5, '角', new Set(['角']), unitsInFen, unitNames, minVal, maxVal, '分');
            expect(result.conversion).toEqual([{ value: 50, unit: '分' }]);
        });

        test('should correctly convert fen to jiao and yuan', () => {
            const result = UnitConverter.generateResult(123, '分', new Set(['分']), unitsInFen, unitNames, minVal, maxVal, '元');
            expect(result.conversion).toEqual([{ value: 1, unit: '元' }, { value: 2, unit: '角' }, { value: 3, unit: '分' }]);
        });
    });

    describe('Time Units', () => {
        const unitsInSeconds = { '小时': 3600, '分': 60, '秒': 1 };
        const unitNames = ['小时', '分', '秒'];

        test('should correctly convert hours to seconds', () => {
            const result = UnitConverter.generateResult(1, '小时', new Set(['小时']), unitsInSeconds, unitNames, minVal, maxVal, '秒');
            expect(result.conversion).toEqual([{ value: 3600, unit: '秒' }]);
        });

        test('should correctly convert minutes to seconds', () => {
            const result = UnitConverter.generateResult(5, '分', new Set(['分']), unitsInSeconds, unitNames, minVal, maxVal, '秒');
            expect(result.conversion).toEqual([{ value: 300, unit: '秒' }]);
        });

        test('should correctly convert seconds to minutes and hours', () => {
            const result = UnitConverter.generateResult(3665, '秒', new Set(['秒']), unitsInSeconds, unitNames, minVal, maxVal, '小时');
            expect(result.conversion).toEqual([{ value: 1, unit: '小时' }, { value: 1, unit: '分' }, { value: 5, unit: '秒' }]);
        });
    });
});