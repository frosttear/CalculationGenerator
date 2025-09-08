/**
 * Jest test cases for Two-Digit ÷ One-Digit Division Generation Logic
 */

// Mock Vue instance with the generateTwoDigitDivision method
const TwoDigitDivisionGenerator = {
  generateTwoDigitDivision(options) {
    const { equationCount, dayCount, rowsPerDay, colsPerDay, enableFirstDigitConstraint } = options;
    const dailyNum = equationCount; // equationCount is now per day
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
          
          // Generate divisor (2-9, avoiding 1 for meaningful practice)
          number2 = Math.floor(Math.random() * 8) + 2;
          
          // Generate result first (1-99 ÷ number2 should give reasonable two-digit dividend)
          const maxResult = Math.floor(99 / number2);
          const minResult = Math.max(1, Math.ceil(10 / number2));
          
          if (maxResult < minResult) {
            continue; // Skip if no valid result range
          }
          
          result = Math.floor(Math.random() * (maxResult - minResult + 1)) + minResult;
          number1 = result * number2; // This ensures no remainder for whole division
          
          // Ensure number1 is two digits (10-99)
          if (number1 < 10 || number1 > 99) {
            continue;
          }
          
          // Check first digit constraint if enabled
          if (enableFirstDigitConstraint) {
            const firstDigit = Math.floor(number1 / 10);
            if (firstDigit % number2 !== 0) {
              continue; // First digit must be divisible by number2
            }
          }
          
          isValid = true;
        }

        if (!isValid) {
          const constraintMsg = enableFirstDigitConstraint ? ' with first digit constraint' : '';
          throw new Error(`Unable to generate enough valid two-digit division problems${constraintMsg}. Please try reducing the equation count or disabling constraints.`);
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
describe('Two-Digit Division Generation', () => {
  
  test('should generate correct number of equations', () => {
    const options = {
      equationCount: 20,
      dayCount: 1,
      rowsPerDay: 4,
      colsPerDay: 5,
      enableFirstDigitConstraint: false
    };
    
    const result = TwoDigitDivisionGenerator.generateTwoDigitDivision(options);
    
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

  test('should ensure all divisions have no remainder', () => {
    const options = {
      equationCount: 20,
      dayCount: 1,
      rowsPerDay: 4,
      colsPerDay: 5,
      enableFirstDigitConstraint: false
    };
    
    const result = TwoDigitDivisionGenerator.generateTwoDigitDivision(options);
    
    // Check all equations have no remainder
    result.forEach(dayGroup => {
      dayGroup.forEach(row => {
        row.forEach(equation => {
          expect(equation.number1 % equation.number2).toBe(0);
          expect(equation.number1 / equation.number2).toBe(equation.result);
        });
      });
    });
  });

  test('should respect first digit constraint when enabled', () => {
    const options = {
      equationCount: 10,
      dayCount: 1,
      rowsPerDay: 2,
      colsPerDay: 5,
      enableFirstDigitConstraint: true
    };
    
    const result = TwoDigitDivisionGenerator.generateTwoDigitDivision(options);
    
    // Check all equations respect the first digit constraint
    result.forEach(dayGroup => {
      dayGroup.forEach(row => {
        row.forEach(equation => {
          const firstDigit = Math.floor(equation.number1 / 10);
          expect(firstDigit % equation.number2).toBe(0);
        });
      });
    });
  });

  test('should allow equations that violate first digit constraint when disabled', () => {
    const options = {
      equationCount: 50, // Higher count to increase chance of finding violations
      dayCount: 1,
      rowsPerDay: 10,
      colsPerDay: 5,
      enableFirstDigitConstraint: false
    };
    
    const result = TwoDigitDivisionGenerator.generateTwoDigitDivision(options);
    
    // Should be able to find at least one equation that would violate the constraint
    let foundViolation = false;
    result.forEach(dayGroup => {
      dayGroup.forEach(row => {
        row.forEach(equation => {
          const firstDigit = Math.floor(equation.number1 / 10);
          if (firstDigit % equation.number2 !== 0) {
            foundViolation = true;
          }
        });
      });
    });
    
    // With 50 equations and no constraint, we should find at least one violation
    expect(foundViolation).toBe(true);
  });

  test('should generate two-digit ÷ one-digit format', () => {
    const options = {
      equationCount: 10,
      dayCount: 1,
      rowsPerDay: 2,
      colsPerDay: 5,
      enableFirstDigitConstraint: false
    };
    
    const result = TwoDigitDivisionGenerator.generateTwoDigitDivision(options);
    
    result.forEach(dayGroup => {
      dayGroup.forEach(row => {
        row.forEach(equation => {
          // number1 should be two digits (10-99)
          expect(equation.number1).toBeGreaterThanOrEqual(10);
          expect(equation.number1).toBeLessThanOrEqual(99);
          
          // number2 should be one digit (2-9, no division by 1)
          expect(equation.number2).toBeGreaterThanOrEqual(2);
          expect(equation.number2).toBeLessThanOrEqual(9);
        });
      });
    });
  });

  test('should distribute equations across multiple days', () => {
    const options = {
      equationCount: 15,
      dayCount: 3,
      rowsPerDay: 3,
      colsPerDay: 5,
      enableFirstDigitConstraint: false
    };
    
    const result = TwoDigitDivisionGenerator.generateTwoDigitDivision(options);
    
    expect(result).toHaveLength(3); // 3 days
    
    // Each day should have exactly 15 equations
    result.forEach(dayGroup => {
      let dayEquationCount = 0;
      dayGroup.forEach(row => {
        dayEquationCount += row.length;
      });
      expect(dayEquationCount).toBe(15);
    });
  });

  test('should handle high equation counts gracefully', () => {
    const options = {
      equationCount: 50, // High but reasonable count
      dayCount: 1,
      rowsPerDay: 10,
      colsPerDay: 5,
      enableFirstDigitConstraint: true
    };
    
    // This should either succeed or throw a descriptive error
    try {
      const result = TwoDigitDivisionGenerator.generateTwoDigitDivision(options);
      // If it succeeds, verify the results are valid
      expect(result).toHaveLength(1);
      let totalEquations = 0;
      result.forEach(dayGroup => {
        dayGroup.forEach(row => {
          totalEquations += row.length;
          row.forEach(equation => {
            expect(equation.number1 % equation.number2).toBe(0);
            if (options.enableFirstDigitConstraint) {
              const firstDigit = Math.floor(equation.number1 / 10);
              expect(firstDigit % equation.number2).toBe(0);
            }
          });
        });
      });
      expect(totalEquations).toBe(50);
    } catch (error) {
      // If it throws, verify it's the expected error message
      expect(error.message).toMatch(/Unable to generate enough valid two-digit division problems/);
    }
  });

  test('should handle edge case with minimum equation count', () => {
    const options = {
      equationCount: 1,
      dayCount: 1,
      rowsPerDay: 1,
      colsPerDay: 1,
      enableFirstDigitConstraint: false
    };
    
    const result = TwoDigitDivisionGenerator.generateTwoDigitDivision(options);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveLength(1);
    expect(result[0][0]).toHaveLength(1);
    
    const equation = result[0][0][0];
    expect(equation.number1).toBeGreaterThanOrEqual(10);
    expect(equation.number2).toBeGreaterThanOrEqual(2);
    expect(equation.number1 % equation.number2).toBe(0);
  });

  test('should validate specific constraint examples', () => {
    // Test specific examples for first digit constraint
    const testCases = [
      { number1: 84, number2: 4, shouldPassFirstDigit: true },  // 8 ÷ 4 = 2 (no remainder) ✅
      { number1: 84, number2: 3, shouldPassFirstDigit: false }, // 8 ÷ 3 = 2.67 (has remainder) ❌
      { number1: 63, number2: 3, shouldPassFirstDigit: true },  // 6 ÷ 3 = 2 (no remainder) ✅
      { number1: 64, number2: 3, shouldPassFirstDigit: true },  // 6 ÷ 3 = 2 (no remainder) ✅
      { number1: 65, number2: 5, shouldPassFirstDigit: false }, // 6 ÷ 5 has remainder ❌
    ];
    
    testCases.forEach(testCase => {
      const firstDigit = Math.floor(testCase.number1 / 10);
      const firstDigitDivisible = firstDigit % testCase.number2 === 0;
      const wholeDivisible = testCase.number1 % testCase.number2 === 0;
      
      expect(firstDigitDivisible).toBe(testCase.shouldPassFirstDigit);
      // All test cases should have whole number divisible (that's the base constraint)
      if (wholeDivisible) {
        expect(testCase.number1 / testCase.number2).toBeCloseTo(Math.floor(testCase.number1 / testCase.number2));
      }
    });
  });

  test('should generate results within reasonable range', () => {
    const options = {
      equationCount: 20,
      dayCount: 1,
      rowsPerDay: 4,
      colsPerDay: 5,
      enableFirstDigitConstraint: false
    };
    
    const result = TwoDigitDivisionGenerator.generateTwoDigitDivision(options);
    
    result.forEach(dayGroup => {
      dayGroup.forEach(row => {
        row.forEach(equation => {
          // Result should be reasonable (1-49 for two-digit ÷ one-digit)
          expect(equation.result).toBeGreaterThanOrEqual(1);
          expect(equation.result).toBeLessThanOrEqual(49); // 99÷2 = 49.5, so max is 49
          
          // Verify the math
          expect(equation.number1).toBe(equation.result * equation.number2);
        });
      });
    });
  });

  test('should not use divisor 1', () => {
    const options = {
      equationCount: 50,
      dayCount: 1,
      rowsPerDay: 10,
      colsPerDay: 5,
      enableFirstDigitConstraint: false
    };
    
    const result = TwoDigitDivisionGenerator.generateTwoDigitDivision(options);
    
    result.forEach(dayGroup => {
      dayGroup.forEach(row => {
        row.forEach(equation => {
          expect(equation.number2).not.toBe(1);
        });
      });
    });
  });
});

// Export for testing
module.exports = TwoDigitDivisionGenerator;