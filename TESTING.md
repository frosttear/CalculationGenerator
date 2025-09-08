# Testing Guide for CalculationGenerator

This project includes comprehensive test suites to validate all functionality using a unified Jest testing framework.

## 🧪 Test Files Overview

### **Jest Test Suites**
- **`CalculationGenerator.test.js`** - Unit tests for basic calculation functions
- **`CalculationGenerator.integration.test.js`** - Integration tests for equation generation
- **`UnitConverter.test.js`** - Comprehensive unit conversion tests (Length, Weight, RMB, Time)
- **`TwoDigitMultiplication.test.js`** - Tests for two-digit × one-digit multiplication constraints
- **`TwoDigitDivision.test.js`** - Tests for two-digit ÷ one-digit division constraints

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
- ✅ Two-digit multiplication constraints validation
- ✅ Two-digit division constraints validation
- ✅ Equation count and distribution testing
- ✅ Error handling for impossible constraints
- ✅ Edge case validation

## 🎯 Test Results Interpretation

### **Jest Test Output**
```
Test Suites: 5 passed, 5 total
Tests:       39 passed, 39 total
Snapshots:   0 total
Time:        1.019 s
```

### **Individual Test Suite Results**
- **CalculationGenerator**: 6 tests (basic arithmetic and equation generation)
- **CalculationGenerator Integration**: 2 tests (mixed precedence and range validation)
- **UnitConverter**: 11 tests (length, weight, RMB, time conversions)
- **TwoDigitMultiplication**: 9 tests (constraint validation and edge cases)
- **TwoDigitDivision**: 11 tests (division constraints and validation)

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
- All 39 tests consistently pass with unified Jest approach
- Jest configuration includes all 5 test suites with verbose output
