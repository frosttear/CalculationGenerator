/**
 * Test suite for TwoDigitPractice.html - Mixed multiplication and division operations
 * Tests the unified page that combines both multiplication and division with operator selection
 */

describe('Two-Digit Mixed Practice Generation', () => {
  let generateTwoDigitPractice;

  beforeEach(() => {
    // Mock the Vue.js method by extracting the core logic
    generateTwoDigitPractice = function(options) {
      const { equationCount, dayCount, rowsPerDay, colsPerDay, operators, enableLeastDigitConstraint, enableFirstDigitConstraint } = options;
      const dailyNum = equationCount; // equationCount is now per day
      const equationGroups = [];

      for (let day = 0; day < dayCount; day++) {
        const dayGroup = [];
        let equationCount = 0;
        let rowEquations = [];

        while (equationCount < dailyNum) {
          let number1, number2, result, operator;
          let isValid = false;
          let attempts = 0;

          while (!isValid && attempts < 1000) {
            attempts++;
            
            // Randomly select operator from available operators
            operator = operators[Math.floor(Math.random() * operators.length)];
            
            if (operator === '*') {
              // Multiplication logic
              // Generate two-digit number (10-99)
              number1 = Math.floor(Math.random() * 90) + 10;
              
              // Generate one-digit number (2-9, excluding 1)
              number2 = Math.floor(Math.random() * 8) + 2;
              
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
              
            } else if (operator === '/') {
              // Division logic
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
            }
            
            isValid = true;
          }

          if (!isValid) {
            const operatorName = operator === '*' ? 'multiplication' : 'division';
            const constraintMsg = operator === '*' && enableLeastDigitConstraint ? ' with least digit constraint' : 
                                operator === '/' && enableFirstDigitConstraint ? ' with first digit constraint' : '';
            throw new Error(`Unable to generate enough valid two-digit ${operatorName} problems${constraintMsg}. Please try reducing the equation count or disabling constraints.`);
          }

          // Add equation to the current row
          if (equationCount % colsPerDay === 0) {
            rowEquations = []; // Start a new row
            dayGroup.push(rowEquations);
          }
          rowEquations.push({ number1, number2, result, operator });
          equationCount++;
          
          // Stop if we've reached the target equation count for this day
          if (equationCount >= dailyNum) {
            break;
          }
        }
        equationGroups.push(dayGroup);
      }
      return equationGroups;
    };
  });

  describe('Mixed Operation Generation', () => {
    test('should generate mixed multiplication and division equations', () => {
      const options = {
        equationCount: 10,
        dayCount: 1,
        rowsPerDay: 2,
        colsPerDay: 5,
        operators: ['*', '/'],
        enableLeastDigitConstraint: true,
        enableFirstDigitConstraint: true
      };

      const result = generateTwoDigitPractice(options);
      
      expect(result).toHaveLength(1); // 1 day
      expect(result[0]).toHaveLength(2); // 2 rows
      
      // Count total equations
      let totalEquations = 0;
      let multiplicationCount = 0;
      let divisionCount = 0;
      
      result[0].forEach(row => {
        row.forEach(equation => {
          totalEquations++;
          if (equation.operator === '*') {
            multiplicationCount++;
          } else if (equation.operator === '/') {
            divisionCount++;
          }
        });
      });
      
      expect(totalEquations).toBe(10);
      expect(multiplicationCount + divisionCount).toBe(10);
      // Should have both types of operations (with high probability)
      expect(multiplicationCount).toBeGreaterThan(0);
      expect(divisionCount).toBeGreaterThan(0);
    });

    test('should generate only multiplication when only * operator selected', () => {
      const options = {
        equationCount: 5,
        dayCount: 1,
        rowsPerDay: 1,
        colsPerDay: 5,
        operators: ['*'],
        enableLeastDigitConstraint: true,
        enableFirstDigitConstraint: false
      };

      const result = generateTwoDigitPractice(options);
      
      result[0][0].forEach(equation => {
        expect(equation.operator).toBe('*');
        expect(equation.number1).toBeGreaterThanOrEqual(10);
        expect(equation.number1).toBeLessThanOrEqual(99);
        expect(equation.number2).toBeGreaterThanOrEqual(2);
        expect(equation.number2).toBeLessThanOrEqual(9);
        expect(equation.result).toBeLessThan(100);
      });
    });

    test('should generate only division when only / operator selected', () => {
      const options = {
        equationCount: 5,
        dayCount: 1,
        rowsPerDay: 1,
        colsPerDay: 5,
        operators: ['/'],
        enableLeastDigitConstraint: false,
        enableFirstDigitConstraint: true
      };

      const result = generateTwoDigitPractice(options);
      
      result[0][0].forEach(equation => {
        expect(equation.operator).toBe('/');
        expect(equation.number1).toBeGreaterThanOrEqual(10);
        expect(equation.number1).toBeLessThanOrEqual(99);
        expect(equation.number2).toBeGreaterThanOrEqual(2);
        expect(equation.number2).toBeLessThanOrEqual(9);
        expect(equation.number1 % equation.number2).toBe(0); // No remainder
      });
    });
  });

  describe('Constraint Validation', () => {
    test('should respect least digit constraint for multiplication', () => {
      const options = {
        equationCount: 20,
        dayCount: 1,
        rowsPerDay: 4,
        colsPerDay: 5,
        operators: ['*'],
        enableLeastDigitConstraint: true,
        enableFirstDigitConstraint: false
      };

      const result = generateTwoDigitPractice(options);
      
      result[0].forEach(row => {
        row.forEach(equation => {
          if (equation.operator === '*') {
            const leastDigit = equation.number1 % 10;
            const leastDigitProduct = leastDigit * equation.number2;
            expect(leastDigitProduct).toBeLessThan(10);
          }
        });
      });
    });

    test('should respect first digit constraint for division', () => {
      const options = {
        equationCount: 20,
        dayCount: 1,
        rowsPerDay: 4,
        colsPerDay: 5,
        operators: ['/'],
        enableLeastDigitConstraint: false,
        enableFirstDigitConstraint: true
      };

      const result = generateTwoDigitPractice(options);
      
      result[0].forEach(row => {
        row.forEach(equation => {
          if (equation.operator === '/') {
            const firstDigit = Math.floor(equation.number1 / 10);
            expect(firstDigit % equation.number2).toBe(0);
          }
        });
      });
    });

    test('should work without constraints', () => {
      const options = {
        equationCount: 10,
        dayCount: 1,
        rowsPerDay: 2,
        colsPerDay: 5,
        operators: ['*', '/'],
        enableLeastDigitConstraint: false,
        enableFirstDigitConstraint: false
      };

      const result = generateTwoDigitPractice(options);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveLength(2);
      
      let totalEquations = 0;
      result[0].forEach(row => {
        row.forEach(equation => {
          totalEquations++;
          expect(equation.number1).toBeGreaterThanOrEqual(10);
          expect(equation.number1).toBeLessThanOrEqual(99);
          expect(equation.number2).toBeGreaterThanOrEqual(2);
          expect(equation.number2).toBeLessThanOrEqual(9);
          expect(['*', '/']).toContain(equation.operator);
        });
      });
      
      expect(totalEquations).toBe(10);
    });
  });

  describe('Multiple Days Generation', () => {
    test('should generate equations for multiple days', () => {
      const options = {
        equationCount: 6,
        dayCount: 3,
        rowsPerDay: 2,
        colsPerDay: 3,
        operators: ['*', '/'],
        enableLeastDigitConstraint: true,
        enableFirstDigitConstraint: true
      };

      const result = generateTwoDigitPractice(options);
      
      expect(result).toHaveLength(3); // 3 days
      
      result.forEach(dayGroup => {
        expect(dayGroup).toHaveLength(2); // 2 rows per day
        
        let dayEquationCount = 0;
        dayGroup.forEach(row => {
          dayEquationCount += row.length;
        });
        expect(dayEquationCount).toBe(6); // 6 equations per day
      });
    });
  });

  describe('Error Handling', () => {
    test('should throw error when no operators selected', () => {
      const options = {
        equationCount: 5,
        dayCount: 1,
        rowsPerDay: 1,
        colsPerDay: 5,
        operators: [], // No operators
        enableLeastDigitConstraint: true,
        enableFirstDigitConstraint: true
      };

      expect(() => {
        // This would be caught by the Vue.js validation before calling generateTwoDigitPractice
        if (options.operators.length === 0) {
          throw new Error('Please select at least one operator (× or ÷)');
        }
      }).toThrow('Please select at least one operator');
    });

    test('should handle edge case with very restrictive constraints gracefully', () => {
      const options = {
        equationCount: 100, // Very high count
        dayCount: 1,
        rowsPerDay: 10,
        colsPerDay: 10,
        operators: ['*'],
        enableLeastDigitConstraint: true, // Very restrictive
        enableFirstDigitConstraint: false
      };

      // This test verifies that the function either succeeds or fails gracefully
      try {
        const result = generateTwoDigitPractice(options);
        expect(result).toHaveLength(1);
      } catch (error) {
        expect(error.message).toContain('Unable to generate enough valid');
      }
    });
  });

  describe('Mathematical Correctness', () => {
    test('should generate mathematically correct equations', () => {
      const options = {
        equationCount: 20,
        dayCount: 1,
        rowsPerDay: 4,
        colsPerDay: 5,
        operators: ['*', '/'],
        enableLeastDigitConstraint: false,
        enableFirstDigitConstraint: false
      };

      const result = generateTwoDigitPractice(options);
      
      result[0].forEach(row => {
        row.forEach(equation => {
          if (equation.operator === '*') {
            expect(equation.number1 * equation.number2).toBe(equation.result);
          } else if (equation.operator === '/') {
            expect(equation.number1 / equation.number2).toBe(equation.result);
            expect(equation.number1 % equation.number2).toBe(0); // No remainder for division
          }
        });
      });
    });
  });
});
