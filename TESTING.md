# Testing Guide for CalculationGenerator

This project includes comprehensive test suites to validate all functionality using a unified Jest testing framework.

## 🧪 Test Files Overview

### **Jest Test Suites**
- **`CalculationGenerator.test.js`** - Unit tests for basic calculation functions
- **`CalculationGenerator.integration.test.js`** - Integration tests for equation generation
- **`UnitConverter.test.js`** - Comprehensive unit conversion tests (Length, Weight, RMB, Time)
- **`TwoDigitMultiplication.test.js`** - Tests for two-digit × one-digit multiplication constraints
- **`TwoDigitDivision.test.js`** - Tests for two-digit ÷ one-digit division constraints
- **`TwoDigitPractice.test.js`** - Tests for mixed two-digit multiplication and division practice
- **`Grade3Semester1Practice.test.js`** - Tests for Grade 3 Semester 1 mixed operations practice

## 🚀 How to Run Tests

### **Option 1: Run All Tests (Recommended)**
```bash
# Run all Jest tests
npm test
# or
npm run test:all
```

### **Option 2: Run Specific Test Categories**
```bash
# Run basic unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run specialized practice tests
npm run test:specialized
```

### **Option 3: Run Individual Test Files**
```bash
# Individual Jest test files
npx jest CalculationGenerator.test.js
npx jest CalculationGenerator.integration.test.js
npx jest UnitConverter.test.js
npx jest TwoDigitMultiplication.test.js
npx jest TwoDigitDivision.test.js
npx jest TwoDigitPractice.test.js
npx jest Grade3Semester1Practice.test.js
```

## 📊 Test Coverage

### **CalculationGenerator Tests**
- ✅ Basic arithmetic operations (+, -, ×, ÷)
- ✅ Equation generation with configurable parameters
- ✅ Mixed operator precedence handling
- ✅ Range validation and integer results
- ✅ Two-operator equation generation

### **UnitConverter Tests**
- ✅ Length unit conversions (km, m, dm, cm, mm)
- ✅ Weight unit conversions (tons, kg, jin, grams)
- ✅ Chinese RMB conversions (yuan, jiao, fen)
- ✅ Time unit conversions (hours, minutes, seconds)
- ✅ Compound result generation

### **Specialized Practice Tests**

#### **Two-Digit Multiplication Tests**
- ✅ Ones digit constraint validation (product < 10)
- ✅ Result constraint validation (result < 100)
- ✅ Two-digit × one-digit format validation
- ✅ Equation count and distribution testing
- ✅ Edge case validation

#### **Two-Digit Division Tests**
- ✅ No remainder constraint validation
- ✅ First digit divisibility constraint (optional)
- ✅ Two-digit ÷ one-digit format validation
- ✅ Error handling for impossible constraints
- ✅ Divisor range validation (excludes 1)

#### **Two-Digit Mixed Practice Tests**
- ✅ Mixed multiplication and division generation
- ✅ Operator selection validation
- ✅ Constraint combinations (least digit + first digit)
- ✅ Mathematical correctness verification
- ✅ Error handling for no operators selected

### **Grade 3 Semester 1 Practice Tests**

#### **Type 1: Mixed Operations (Two Operators)**
- ✅ Correct equation count generation
- ✅ One +/- and one ×/÷ operator constraint
- ✅ Division operations with no remainder
- ✅ Multiplication products < 100
- ✅ Valid integer results
- ✅ Two-digit number format validation

#### **Type 2: Three-Digit Addition/Subtraction**
- ✅ Correct equation count generation
- ✅ Result ≤ 1000 constraint for addition
- ✅ Three-digit numbers (100-999) or 1000 for subtraction minuend
- ✅ Operator validation (+/- only)
- ✅ Non-negative subtraction results
- ✅ Mathematical correctness
- ✅ Row distribution based on columns
- ✅ Edge case handling (1 equation)

#### **Integration Tests**
- ✅ Multi-day generation for both types
- ✅ Custom configuration handling

## 🎯 Test Results Interpretation

### **Jest Test Output**
```
Test Suites: 7 passed, 7 total
Tests:       68 passed, 68 total
Snapshots:   0 total
Time:        ~1.0 s
```

### **Individual Test Suite Results**
- **CalculationGenerator**: 9 tests (basic arithmetic and equation generation)
- **CalculationGenerator Integration**: 2 tests (mixed precedence and range validation)
- **UnitConverter**: 11 tests (length, weight, RMB, time conversions)
- **TwoDigitMultiplication**: 9 tests (constraint validation and edge cases)
- **TwoDigitDivision**: 11 tests (division constraints and validation)
- **TwoDigitPractice**: 10 tests (mixed operations, operator selection, constraints)
- **Grade3Semester1Practice**: 16 tests (Type 1 mixed operations, Type 2 three-digit calculations, integration)

## 🛠️ Adding New Tests

### **For Jest Tests**
1. Create a new `.test.js` file
2. Use Jest syntax (`describe`, `test`, `expect`)
3. Add to `jest.config.js` testMatch array if needed
4. Follow existing patterns in current test files

## 📋 Test Scripts Summary

| Command | Description |
|---------|-------------|
| `npm test` | Run all Jest tests (unified approach) |
| `npm run test:unit` | Run basic unit tests |
| `npm run test:integration` | Run integration tests |
| `npm run test:specialized` | Run specialized practice tests |
| `npm run test:all` | Same as `npm test` (all tests) |

## 🔧 Development Workflow

1. **Before committing**: Run `npm test` to ensure all tests pass
2. **Adding new features**: Write corresponding Jest tests
3. **Debugging**: Use individual test commands to isolate issues
4. **CI/CD**: Use `npm test` for automated testing
5. **Test Development**: Follow existing patterns in current test files

## 📝 Notes

- All tests use the Jest framework (already installed and configured)
- Tests validate mathematical correctness and constraint compliance
- Robust error handling accounts for randomness in equation generation
- All **68 tests** consistently pass with unified Jest approach
- Jest configuration includes all **7 test suites** with verbose output
- Comprehensive coverage includes:
  - Basic calculations and equation generation
  - Unit conversions (length, weight, RMB, time)
  - Specialized two-digit multiplication and division with constraints
  - Mixed two-digit practice with operator selection
  - Grade 3 Semester 1 practice with two equation types:
    - Type 1: Mixed operations (one +/-, one ×/÷)
    - Type 2: Three-digit addition/subtraction (result ≤ 1000, supports 1000 as minuend)
- Tests include validation for edge cases, constraint compliance, and mathematical correctness
- Flaky tests have been resolved by increasing sample sizes for statistical reliability
