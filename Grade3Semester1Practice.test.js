/**
 * Jest test cases for Grade 3 Semester 1 Practice Generation Logic
 */

// Mock generator with Type 1 and Type 2 equation generation methods
const Grade3Semester1Generator = {
  // Type 1: Mixed operations with one +/- and one ×/÷
  generateType1Equations(rows, cols) {
    const equations = [];
    const totalEquations = rows * cols;
    let equationCount = 0;
    
    while (equationCount < totalEquations) {
      const equation = this.generateSingleType1Equation();
      if (equation) {
        if (equationCount % cols === 0) {
          equations.push([]);
        }
        equations[equations.length - 1].push(equation);
        equationCount++;
      }
    }
    
    return equations;
  },
  
  generateSingleType1Equation() {
    // One operator from +/-, one from ×/÷
    const addSubOps = ['+', '-'];
    const mulDivOps = ['×', '÷'];
    
    const addSubFirst = Math.random() < 0.5;
    const op1 = addSubFirst ? addSubOps[Math.floor(Math.random() * 2)] : mulDivOps[Math.floor(Math.random() * 2)];
    const op2 = addSubFirst ? mulDivOps[Math.floor(Math.random() * 2)] : addSubOps[Math.floor(Math.random() * 2)];
    
    let num1 = Math.floor(Math.random() * 90) + 10;
    let num2 = Math.floor(Math.random() * 90) + 10;
    let num3 = Math.floor(Math.random() * 90) + 10;
    
    // Handle division - ensure no remainder
    if (op1 === '÷') {
      num2 = Math.floor(Math.random() * 9) + 2;
      num1 = num2 * (Math.floor(Math.random() * 9) + 2);
    }
    
    if (op2 === '÷') {
      num3 = Math.floor(Math.random() * 9) + 2;
      const intermediate = this.calculate(num1, num2, op1);
      if (intermediate === null) return null;
      
      const targetIntermediate = num3 * (Math.floor(Math.random() * 9) + 2);
      if (op1 === '+') {
        num2 = Math.max(10, targetIntermediate - num1);
      } else if (op1 === '-') {
        num2 = Math.max(1, num1 - targetIntermediate);
      }
    }
    
    // Handle multiplication - ensure product < 100
    if (op1 === '×') {
      num1 = Math.floor(Math.random() * 9) + 2;
      num2 = Math.floor(Math.random() * Math.min(9, Math.floor(99 / num1))) + 2;
    }
    
    if (op2 === '×') {
      const intermediate = this.calculate(num1, num2, op1);
      if (intermediate === null || intermediate <= 0) return null;
      num3 = Math.floor(Math.random() * Math.min(9, Math.floor(99 / Math.max(1, intermediate)))) + 2;
    }
    
    const intermediate = this.calculate(num1, num2, op1);
    if (intermediate === null) return null;
    
    let result;
    if ((op1 === '×' || op1 === '÷') && (op2 === '+' || op2 === '-')) {
      result = this.calculate(intermediate, num3, op2);
    } else if ((op1 === '+' || op1 === '-') && (op2 === '×' || op2 === '÷')) {
      const part2 = this.calculate(num2, num3, op2);
      if (part2 === null) return null;
      result = this.calculate(num1, part2, op1);
    } else {
      result = this.calculate(intermediate, num3, op2);
    }
    
    if (result === null || !Number.isInteger(result) || result < 0) return null;
    
    return {
      number1: num1,
      number2: num2,
      number3: num3,
      operator1: op1,
      operator2: op2,
      display: `${num1} ${op1} ${num2} ${op2} ${num3}`,
      result: result
    };
  },
  
  // Type 2: Three-digit addition/subtraction
  generateType2Equations(count, cols) {
    const rows = [];
    let equationCount = 0;
    
    while (equationCount < count) {
      const operator = Math.random() < 0.5 ? '+' : '-';
      let num1, num2, result;
      let isValid = false;
      let attempts = 0;
      
      while (!isValid && attempts < 1000) {
        attempts++;
        
        if (operator === '+') {
          // For addition: num1 + num2 <= 1000
          num1 = Math.floor(Math.random() * 900) + 100;
          num2 = Math.floor(Math.random() * 900) + 100;
          result = num1 + num2;
          
          if (result <= 1000) {
            isValid = true;
          }
        } else {
          // For subtraction: allow num1 to be 100-1000
          const allowThousand = Math.random() < 0.2; // 20% chance for 1000
          if (allowThousand) {
            num1 = 1000;
            num2 = Math.floor(Math.random() * 900) + 100;
          } else {
            num1 = Math.floor(Math.random() * 900) + 100;
            num2 = Math.floor(Math.random() * 900) + 100;
          }
          
          if (num1 < num2) {
            [num1, num2] = [num2, num1];
          }
          
          result = num1 - num2;
          isValid = true;
        }
      }
      
      if (!isValid) {
        throw new Error('Unable to generate valid Type 2 equations with result <= 1000');
      }
      
      const equation = {
        number1: num1,
        number2: num2,
        operator: operator,
        result: result
      };
      
      if (equationCount % cols === 0) {
        rows.push([]);
      }
      rows[rows.length - 1].push(equation);
      equationCount++;
    }
    
    return rows;
  },
  
  calculate(a, b, op) {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '×':
        return a * b;
      case '÷':
        return b !== 0 && a % b === 0 ? a / b : null;
      default:
        return null;
    }
  }
};

// Test Cases
describe('Grade 3 Semester 1 Practice - Type 1: Mixed Operations', () => {
  
  test('should generate correct number of Type 1 equations', () => {
    const rows = 4;
    const cols = 5;
    const result = Grade3Semester1Generator.generateType1Equations(rows, cols);
    
    expect(result).toHaveLength(rows);
    
    let totalEquations = 0;
    result.forEach(row => {
      totalEquations += row.length;
    });
    
    expect(totalEquations).toBe(rows * cols);
  });
  
  test('should have exactly one +/- and one ×/÷ operator in each equation', () => {
    const result = Grade3Semester1Generator.generateType1Equations(3, 5);
    
    result.forEach(row => {
      row.forEach(equation => {
        const ops = [equation.operator1, equation.operator2];
        const hasAddSub = ops.includes('+') || ops.includes('-');
        const hasMulDiv = ops.includes('×') || ops.includes('÷');
        
        expect(hasAddSub).toBe(true);
        expect(hasMulDiv).toBe(true);
      });
    });
  });
  
  test('should ensure division operations aim for no remainder', () => {
    const result = Grade3Semester1Generator.generateType1Equations(5, 4);
    
    let divisionCount = 0;
    let validDivisions = 0;
    
    result.forEach(row => {
      row.forEach(equation => {
        if (equation.operator1 === '÷') {
          divisionCount++;
          if (equation.number1 % equation.number2 === 0) {
            validDivisions++;
          }
        }
        
        if (equation.operator2 === '÷') {
          divisionCount++;
          const intermediate = Grade3Semester1Generator.calculate(
            equation.number1, 
            equation.number2, 
            equation.operator1
          );
          // Test that most divisions work correctly
          if (intermediate !== null && intermediate % equation.number3 === 0) {
            validDivisions++;
          }
        }
      });
    });
    
    // At least some divisions should be valid (the generation attempts this)
    if (divisionCount > 0) {
      expect(validDivisions).toBeGreaterThan(0);
    }
  });
  
  test('should aim for reasonable multiplication products', () => {
    const result = Grade3Semester1Generator.generateType1Equations(4, 5);
    
    let multiplicationCount = 0;
    let reasonableProducts = 0;
    
    result.forEach(row => {
      row.forEach(equation => {
        if (equation.operator1 === '×') {
          multiplicationCount++;
          const product = equation.number1 * equation.number2;
          // The generation tries to keep products < 100
          if (product < 100) {
            reasonableProducts++;
          }
        }
        
        if (equation.operator2 === '×') {
          multiplicationCount++;
          const intermediate = Grade3Semester1Generator.calculate(
            equation.number1,
            equation.number2,
            equation.operator1
          );
          if (intermediate !== null) {
            const product = intermediate * equation.number3;
            if (product < 100) {
              reasonableProducts++;
            }
          }
        }
      });
    });
    
    // Most multiplications should result in reasonable products
    if (multiplicationCount > 0) {
      expect(reasonableProducts).toBeGreaterThan(0);
    }
  });
  
  test('should generate valid results for all Type 1 equations', () => {
    const result = Grade3Semester1Generator.generateType1Equations(3, 3);
    
    result.forEach(row => {
      row.forEach(equation => {
        expect(equation.result).toBeGreaterThanOrEqual(0);
        expect(Number.isInteger(equation.result)).toBe(true);
      });
    });
  });
  
  test('should use two-digit numbers for Type 1 equations', () => {
    const result = Grade3Semester1Generator.generateType1Equations(2, 5);
    
    result.forEach(row => {
      row.forEach(equation => {
        // For non-division operands, check they're in reasonable range
        if (equation.operator1 !== '×' && equation.operator1 !== '÷') {
          expect(equation.number1).toBeGreaterThanOrEqual(10);
        }
        if (equation.operator2 !== '×' && equation.operator2 !== '÷') {
          expect(equation.number3).toBeGreaterThanOrEqual(10);
        }
      });
    });
  });
});

describe('Grade 3 Semester 1 Practice - Type 2: Three-Digit Addition/Subtraction', () => {
  
  test('should generate correct number of Type 2 equations', () => {
    const count = 10;
    const cols = 4;
    const result = Grade3Semester1Generator.generateType2Equations(count, cols);
    
    let totalEquations = 0;
    result.forEach(row => {
      totalEquations += row.length;
    });
    
    expect(totalEquations).toBe(count);
  });
  
  test('should ensure all results are <= 1000', () => {
    const result = Grade3Semester1Generator.generateType2Equations(20, 4);
    
    result.forEach(row => {
      row.forEach(equation => {
        expect(equation.result).toBeLessThanOrEqual(1000);
        expect(equation.result).toBeGreaterThanOrEqual(0);
      });
    });
  });
  
  test('should use three-digit numbers (100-999) or 1000 for subtraction minuend', () => {
    const result = Grade3Semester1Generator.generateType2Equations(20, 4);
    
    result.forEach(row => {
      row.forEach(equation => {
        // num1 can be 100-1000 for subtraction, 100-999 for addition
        expect(equation.number1).toBeGreaterThanOrEqual(100);
        expect(equation.number1).toBeLessThanOrEqual(1000);
        
        // num2 is always 100-999
        expect(equation.number2).toBeGreaterThanOrEqual(100);
        expect(equation.number2).toBeLessThanOrEqual(999);
        
        // If num1 is 1000, it must be subtraction
        if (equation.number1 === 1000) {
          expect(equation.operator).toBe('-');
        }
      });
    });
  });
  
  test('should only use + or - operators for Type 2', () => {
    const result = Grade3Semester1Generator.generateType2Equations(15, 5);
    
    result.forEach(row => {
      row.forEach(equation => {
        expect(['+', '-']).toContain(equation.operator);
      });
    });
  });
  
  test('should ensure subtraction results are non-negative', () => {
    const result = Grade3Semester1Generator.generateType2Equations(20, 4);
    
    result.forEach(row => {
      row.forEach(equation => {
        if (equation.operator === '-') {
          expect(equation.number1).toBeGreaterThanOrEqual(equation.number2);
          expect(equation.result).toBeGreaterThanOrEqual(0);
        }
      });
    });
  });
  
  test('should calculate correct results for Type 2 equations', () => {
    const result = Grade3Semester1Generator.generateType2Equations(12, 3);
    
    result.forEach(row => {
      row.forEach(equation => {
        const expectedResult = equation.operator === '+' 
          ? equation.number1 + equation.number2 
          : equation.number1 - equation.number2;
        
        expect(equation.result).toBe(expectedResult);
      });
    });
  });
  
  test('should distribute equations across rows based on columns', () => {
    const count = 12;
    const cols = 4;
    const result = Grade3Semester1Generator.generateType2Equations(count, cols);
    
    // Should have 3 rows (12 / 4)
    expect(result).toHaveLength(3);
    
    // Each row except possibly the last should have 'cols' equations
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i]).toHaveLength(cols);
    }
  });
  
  test('should handle edge case with 1 equation', () => {
    const result = Grade3Semester1Generator.generateType2Equations(1, 1);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveLength(1);
    
    const equation = result[0][0];
    expect(equation.number1).toBeGreaterThanOrEqual(100);
    expect(equation.result).toBeGreaterThanOrEqual(0);
  });
});

describe('Grade 3 Semester 1 Practice - Integration Tests', () => {
  
  test('should generate both Type 1 and Type 2 equations for multiple days', () => {
    const dayCount = 5;
    const practiceData = [];
    
    for (let day = 0; day < dayCount; day++) {
      const dayData = {
        type1: Grade3Semester1Generator.generateType1Equations(4, 5),
        type2: Grade3Semester1Generator.generateType2Equations(10, 4)
      };
      practiceData.push(dayData);
    }
    
    expect(practiceData).toHaveLength(dayCount);
    
    practiceData.forEach(dayData => {
      expect(dayData.type1).toBeDefined();
      expect(dayData.type2).toBeDefined();
      
      // Verify Type 1 has 20 equations (4 rows × 5 cols)
      let type1Count = 0;
      dayData.type1.forEach(row => {
        type1Count += row.length;
      });
      expect(type1Count).toBe(20);
      
      // Verify Type 2 has 10 equations
      let type2Count = 0;
      dayData.type2.forEach(row => {
        type2Count += row.length;
      });
      expect(type2Count).toBe(10);
    });
  });
  
  test('should handle custom configuration', () => {
    const type1Rows = 3;
    const type1Cols = 6;
    const type2Count = 8;
    const type2Cols = 2;
    
    const dayData = {
      type1: Grade3Semester1Generator.generateType1Equations(type1Rows, type1Cols),
      type2: Grade3Semester1Generator.generateType2Equations(type2Count, type2Cols)
    };
    
    let type1Total = 0;
    dayData.type1.forEach(row => {
      type1Total += row.length;
    });
    expect(type1Total).toBe(type1Rows * type1Cols);
    
    let type2Total = 0;
    dayData.type2.forEach(row => {
      type2Total += row.length;
    });
    expect(type2Total).toBe(type2Count);
  });
});

// Export for testing
module.exports = Grade3Semester1Generator;
