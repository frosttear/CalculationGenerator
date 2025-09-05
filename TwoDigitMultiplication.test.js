/**
 * Test cases for Two-Digit × One-Digit Multiplication Generation Logic
 */

// Mock Vue instance with the generateTwoDigitMultiplication method
const TwoDigitMultiplicationGenerator = {
  generateTwoDigitMultiplication(options) {
    const { equationCount, dayCount, rowsPerDay, colsPerDay, enableLeastDigitConstraint } = options;
    const dailyNum = Math.ceil(equationCount / dayCount);
    const equationGroups = [];

    for (let day = 0; day < dayCount; day++) {
      const dayGroup = [];
      let equationCount = 0;

      while (equationCount < dailyNum) {
        let number1, number2, result;
        let isValid = false;
        let attempts = 0;

        while (!isValid && attempts < 1000) {
          attempts++;
          
          // Generate two-digit number (10-99)
          number1 = Math.floor(Math.random() * 90) + 10;
          
          // Generate one-digit number (1-9)
          number2 = Math.floor(Math.random() * 9) + 1;
          
          // Check constraint 1: least significant digit product < 10 (if enabled)
          if (enableLeastDigitConstraint) {
            const leastDigit = number1 % 10;
            const leastDigitProduct = leastDigit * number2;
            
            if (leastDigitProduct >= 10) {
              continue; // Skip this combination
            }
          }
          
          // Check constraint 2: final result < 100
          result = number1 * number2;
          if (result >= 100) {
            continue; // Skip this combination
          }
          
          isValid = true;
        }

        if (!isValid) {
          const constraintMsg = enableLeastDigitConstraint ? ' with least digit constraint' : '';
          throw new Error(`Unable to generate enough valid two-digit multiplication problems${constraintMsg}. Please try reducing the equation count or disabling constraints.`);
        }

        // Add equation to the current row
        if (equationCount % colsPerDay === 0) {
          rowEquations = []; // Start a new row
          dayGroup.push(rowEquations);
        }
        rowEquations.push({ number1, number2, result });
        equationCount++;
        
        // Stop if we've reached the target equation count for this day
        if (equationCount >= dailyNum) {
          break;
        }
      }
      equationGroups.push(dayGroup);
    }
    return equationGroups;
  }
};

// Test Cases
describe('Two-Digit Multiplication Generation', () => {
  
  test('should generate correct number of equations', () => {
    const options = {
      equationCount: 20,
      dayCount: 1,
      rowsPerDay: 4,
      colsPerDay: 5,
      enableLeastDigitConstraint: true
    };
    
    const result = TwoDigitMultiplicationGenerator.generateTwoDigitMultiplication(options);
    
    expect(result).toHaveLength(1); // 1 day
    
    // Count total equations
    let totalEquations = 0;
    result.forEach(dayGroup => {
      dayGroup.forEach(row => {
        totalEquations += row.length;
      });
    });
    
    expect(totalEquations).toBe(20);
  });

  test('should respect least digit constraint when enabled', () => {
    const options = {
      equationCount: 10,
      dayCount: 1,
      rowsPerDay: 2,
      colsPerDay: 5,
      enableLeastDigitConstraint: true
    };
    
    const result = TwoDigitMultiplicationGenerator.generateTwoDigitMultiplication(options);
    
    // Check all equations respect the constraint
    result.forEach(dayGroup => {
      dayGroup.forEach(row => {
        row.forEach(equation => {
          const leastDigit = equation.number1 % 10;
          const leastDigitProduct = leastDigit * equation.number2;
          expect(leastDigitProduct).toBeLessThan(10);
        });
      });
    });
  });

  test('should allow equations that violate least digit constraint when disabled', () => {
    const options = {
      equationCount: 50, // Higher count to increase chance of finding violations
      dayCount: 1,
      rowsPerDay: 10,
      colsPerDay: 5,
      enableLeastDigitConstraint: false
    };
    
    const result = TwoDigitMultiplicationGenerator.generateTwoDigitMultiplication(options);
    
    // Should be able to find at least one equation that would violate the constraint
    let foundViolation = false;
    result.forEach(dayGroup => {
      dayGroup.forEach(row => {
        row.forEach(equation => {
          const leastDigit = equation.number1 % 10;
          const leastDigitProduct = leastDigit * equation.number2;
          if (leastDigitProduct >= 10) {
            foundViolation = true;
          }
        });
      });
    });
    
    // With 50 equations and no constraint, we should find at least one violation
    expect(foundViolation).toBe(true);
  });

  test('should ensure all results are less than 100', () => {
    const options = {
      equationCount: 20,
      dayCount: 1,
      rowsPerDay: 4,
      colsPerDay: 5,
      enableLeastDigitConstraint: false
    };
    
    const result = TwoDigitMultiplicationGenerator.generateTwoDigitMultiplication(options);
    
    // Check all results are < 100
    result.forEach(dayGroup => {
      dayGroup.forEach(row => {
        row.forEach(equation => {
          expect(equation.result).toBeLessThan(100);
          expect(equation.result).toBe(equation.number1 * equation.number2);
        });
      });
    });
  });

  test('should generate two-digit × one-digit format', () => {
    const options = {
      equationCount: 10,
      dayCount: 1,
      rowsPerDay: 2,
      colsPerDay: 5,
      enableLeastDigitConstraint: true
    };
    
    const result = TwoDigitMultiplicationGenerator.generateTwoDigitMultiplication(options);
    
    result.forEach(dayGroup => {
      dayGroup.forEach(row => {
        row.forEach(equation => {
          // number1 should be two digits (10-99)
          expect(equation.number1).toBeGreaterThanOrEqual(10);
          expect(equation.number1).toBeLessThanOrEqual(99);
          
          // number2 should be one digit (1-9)
          expect(equation.number2).toBeGreaterThanOrEqual(1);
          expect(equation.number2).toBeLessThanOrEqual(9);
        });
      });
    });
  });

  test('should distribute equations across multiple days', () => {
    const options = {
      equationCount: 20,
      dayCount: 4,
      rowsPerDay: 3,
      colsPerDay: 2,
      enableLeastDigitConstraint: true
    };
    
    const result = TwoDigitMultiplicationGenerator.generateTwoDigitMultiplication(options);
    
    expect(result).toHaveLength(4); // 4 days
    
    // Each day should have approximately 5 equations (20/4)
    result.forEach(dayGroup => {
      let dayEquationCount = 0;
      dayGroup.forEach(row => {
        dayEquationCount += row.length;
      });
      expect(dayEquationCount).toBeGreaterThanOrEqual(4);
      expect(dayEquationCount).toBeLessThanOrEqual(6);
    });
  });

  test('should throw error when constraints make generation impossible', () => {
    const options = {
      equationCount: 1000, // Very high count
      dayCount: 1,
      rowsPerDay: 50,
      colsPerDay: 20,
      enableLeastDigitConstraint: true
    };
    
    // This should throw an error due to impossible constraints
    expect(() => {
      TwoDigitMultiplicationGenerator.generateTwoDigitMultiplication(options);
    }).toThrow(/Unable to generate enough valid two-digit multiplication problems/);
  });

  test('should handle edge case with minimum equation count', () => {
    const options = {
      equationCount: 1,
      dayCount: 1,
      rowsPerDay: 1,
      colsPerDay: 1,
      enableLeastDigitConstraint: true
    };
    
    const result = TwoDigitMultiplicationGenerator.generateTwoDigitMultiplication(options);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveLength(1);
    expect(result[0][0]).toHaveLength(1);
    
    const equation = result[0][0][0];
    expect(equation.number1).toBeGreaterThanOrEqual(10);
    expect(equation.number2).toBeGreaterThanOrEqual(1);
    expect(equation.result).toBeLessThan(100);
  });

  test('should validate specific constraint examples', () => {
    // Test specific examples mentioned in requirements
    const testCases = [
      { number1: 14, number2: 2, shouldPass: true },  // 4 × 2 = 8 < 10 ✅
      { number1: 14, number2: 3, shouldPass: false }, // 4 × 3 = 12 > 10 ❌
      { number1: 23, number2: 4, shouldPass: false }, // 3 × 4 = 12 > 10 ❌
      { number1: 21, number2: 4, shouldPass: true },  // 1 × 4 = 4 < 10 ✅
    ];
    
    testCases.forEach(testCase => {
      const leastDigit = testCase.number1 % 10;
      const leastDigitProduct = leastDigit * testCase.number2;
      const passesConstraint = leastDigitProduct < 10;
      
      expect(passesConstraint).toBe(testCase.shouldPass);
    });
  });
});

// Run tests (if using Node.js testing environment)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TwoDigitMultiplicationGenerator;
}

console.log('Two-Digit Multiplication Test Cases Created');
console.log('Run these tests using Jest or another testing framework');
console.log('Example: npm test TwoDigitMultiplication.test.js');
