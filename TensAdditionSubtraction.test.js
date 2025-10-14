/**
 * Jest test cases for Tens Addition and Subtraction Practice
 */

// Mock generator for tens addition/subtraction
const TensAdditionSubtractionGenerator = {
  generateEquations(options) {
    const { rangeStart, rangeEnd, rowCount, columnCount, operators } = options;
    const columns = [];
    
    for (let c = 0; c < columnCount; c++) {
      const column = [];
      for (let i = 0; i < rowCount; i++) {
        const equation = this.generateSingleEquation(rangeStart, rangeEnd, operators);
        if (equation) {
          column.push(equation);
        }
      }
      columns.push(column);
    }
    
    return columns;
  },
  
  generateSingleEquation(rangeStart, rangeEnd, operators) {
    const selectedOperators = operators.length === 0 ? ['+'] : operators;
    let number1, number2, operator, result;
    let isValid = false;
    let attempts = 0;
    
    while (!isValid && attempts < 1000) {
      attempts++;
      isValid = true;
      
      // Generate multiples of 10 within range
      const tensInRange = [];
      for (let n = Math.ceil(rangeStart / 10) * 10; n <= rangeEnd; n += 10) {
        if (n >= rangeStart && n <= rangeEnd) {
          tensInRange.push(n);
        }
      }
      
      if (tensInRange.length < 1) {
        return null;
      }
      
      // At least one number must be a multiple of 10
      const firstIsTen = Math.random() < 0.5;
      
      if (firstIsTen) {
        number1 = tensInRange[Math.floor(Math.random() * tensInRange.length)];
        number2 = Math.floor(Math.random() * (rangeEnd - rangeStart + 1)) + rangeStart;
      } else {
        number1 = Math.floor(Math.random() * (rangeEnd - rangeStart + 1)) + rangeStart;
        number2 = tensInRange[Math.floor(Math.random() * tensInRange.length)];
      }
      
      operator = selectedOperators[Math.floor(Math.random() * selectedOperators.length)];
      result = this.calculateResult(number1, number2, operator);
      
      // For subtraction, ensure result is non-negative and within range
      if (operator === '−') {
        if (result < 0 || result < rangeStart) {
          isValid = false;
          continue;
        }
      }
      
      // For addition, ensure result is within range
      if (operator === '+') {
        if (result > rangeEnd) {
          isValid = false;
          continue;
        }
      }
    }
    
    if (!isValid) {
      return null;
    }
    
    return { number1, number2, operator, result };
  },
  
  calculateResult(number1, number2, operator) {
    switch (operator) {
      case '+':
        return number1 + number2;
      case '−':
        return number1 - number2;
      default:
        return 0;
    }
  }
};

// Test Cases
describe('Tens Addition and Subtraction Practice', () => {
  
  test('should generate correct number of equations', () => {
    const options = {
      rangeStart: 10,
      rangeEnd: 100,
      rowCount: 20,
      columnCount: 5,
      operators: ['+', '−']
    };
    
    const result = TensAdditionSubtractionGenerator.generateEquations(options);
    
    expect(result).toHaveLength(5); // 5 columns
    
    result.forEach(column => {
      expect(column.length).toBe(20); // 20 rows per column
    });
  });
  
  test('should ensure at least one number is a multiple of 10', () => {
    const options = {
      rangeStart: 10,
      rangeEnd: 100,
      rowCount: 50,
      columnCount: 3,
      operators: ['+', '−']
    };
    
    const result = TensAdditionSubtractionGenerator.generateEquations(options);
    
    result.forEach(column => {
      column.forEach(equation => {
        const num1IsTen = equation.number1 % 10 === 0;
        const num2IsTen = equation.number2 % 10 === 0;
        
        // At least one should be a multiple of 10
        expect(num1IsTen || num2IsTen).toBe(true);
      });
    });
  });
  
  test('should generate only + and − operators', () => {
    const options = {
      rangeStart: 10,
      rangeEnd: 100,
      rowCount: 20,
      columnCount: 2,
      operators: ['+', '−']
    };
    
    const result = TensAdditionSubtractionGenerator.generateEquations(options);
    
    result.forEach(column => {
      column.forEach(equation => {
        expect(['+', '−']).toContain(equation.operator);
      });
    });
  });
  
  test('should ensure subtraction results are non-negative', () => {
    const options = {
      rangeStart: 10,
      rangeEnd: 100,
      rowCount: 30,
      columnCount: 3,
      operators: ['−']
    };
    
    const result = TensAdditionSubtractionGenerator.generateEquations(options);
    
    result.forEach(column => {
      column.forEach(equation => {
        expect(equation.result).toBeGreaterThanOrEqual(0);
        expect(equation.number1).toBeGreaterThanOrEqual(equation.number2);
      });
    });
  });
  
  test('should ensure all results are within range', () => {
    const options = {
      rangeStart: 10,
      rangeEnd: 100,
      rowCount: 25,
      columnCount: 2,
      operators: ['+', '−']
    };
    
    const result = TensAdditionSubtractionGenerator.generateEquations(options);
    
    result.forEach(column => {
      column.forEach(equation => {
        if (equation.operator === '+') {
          expect(equation.result).toBeLessThanOrEqual(options.rangeEnd);
        }
        expect(equation.result).toBeGreaterThanOrEqual(0);
      });
    });
  });
  
  test('should calculate results correctly', () => {
    const options = {
      rangeStart: 10,
      rangeEnd: 100,
      rowCount: 15,
      columnCount: 2,
      operators: ['+', '−']
    };
    
    const result = TensAdditionSubtractionGenerator.generateEquations(options);
    
    result.forEach(column => {
      column.forEach(equation => {
        const expectedResult = equation.operator === '+' 
          ? equation.number1 + equation.number2 
          : equation.number1 - equation.number2;
        
        expect(equation.result).toBe(expectedResult);
      });
    });
  });
  
  test('should handle addition only', () => {
    const options = {
      rangeStart: 10,
      rangeEnd: 80,
      rowCount: 10,
      columnCount: 2,
      operators: ['+']
    };
    
    const result = TensAdditionSubtractionGenerator.generateEquations(options);
    
    result.forEach(column => {
      column.forEach(equation => {
        expect(equation.operator).toBe('+');
        expect(equation.result).toBe(equation.number1 + equation.number2);
      });
    });
  });
  
  test('should handle subtraction only', () => {
    const options = {
      rangeStart: 10,
      rangeEnd: 100,
      rowCount: 10,
      columnCount: 2,
      operators: ['−']
    };
    
    const result = TensAdditionSubtractionGenerator.generateEquations(options);
    
    result.forEach(column => {
      column.forEach(equation => {
        expect(equation.operator).toBe('−');
        expect(equation.result).toBe(equation.number1 - equation.number2);
      });
    });
  });
  
  test('should work with different ranges', () => {
    const options = {
      rangeStart: 20,
      rangeEnd: 90,
      rowCount: 10,
      columnCount: 2,
      operators: ['+', '−']
    };
    
    const result = TensAdditionSubtractionGenerator.generateEquations(options);
    
    result.forEach(column => {
      column.forEach(equation => {
        expect(equation.number1).toBeGreaterThanOrEqual(options.rangeStart);
        expect(equation.number1).toBeLessThanOrEqual(options.rangeEnd);
        expect(equation.number2).toBeGreaterThanOrEqual(options.rangeStart);
        expect(equation.number2).toBeLessThanOrEqual(options.rangeEnd);
      });
    });
  });
  
  test('should handle edge case with small range', () => {
    const options = {
      rangeStart: 10,
      rangeEnd: 30,
      rowCount: 5,
      columnCount: 1,
      operators: ['+', '−']
    };
    
    const result = TensAdditionSubtractionGenerator.generateEquations(options);
    
    expect(result).toHaveLength(1);
    expect(result[0].length).toBe(5);
    
    result[0].forEach(equation => {
      const num1IsTen = equation.number1 % 10 === 0;
      const num2IsTen = equation.number2 % 10 === 0;
      expect(num1IsTen || num2IsTen).toBe(true);
    });
  });
  
  test('should validate that multiples of 10 are in range', () => {
    const options = {
      rangeStart: 10,
      rangeEnd: 100,
      rowCount: 30,
      columnCount: 2,
      operators: ['+', '−']
    };
    
    const result = TensAdditionSubtractionGenerator.generateEquations(options);
    
    result.forEach(column => {
      column.forEach(equation => {
        if (equation.number1 % 10 === 0) {
          expect(equation.number1).toBeGreaterThanOrEqual(10);
          expect(equation.number1).toBeLessThanOrEqual(100);
          expect(equation.number1 % 10).toBe(0);
        }
        
        if (equation.number2 % 10 === 0) {
          expect(equation.number2).toBeGreaterThanOrEqual(10);
          expect(equation.number2).toBeLessThanOrEqual(100);
          expect(equation.number2 % 10).toBe(0);
        }
      });
    });
  });
  
  test('should handle default to addition when no operators selected', () => {
    const options = {
      rangeStart: 10,
      rangeEnd: 80,
      rowCount: 10,
      columnCount: 2,
      operators: []
    };
    
    const result = TensAdditionSubtractionGenerator.generateEquations(options);
    
    result.forEach(column => {
      column.forEach(equation => {
        expect(equation.operator).toBe('+');
      });
    });
  });
});

// Export for testing
module.exports = TensAdditionSubtractionGenerator;
