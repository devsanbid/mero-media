# Backend Model Testing Suite

This directory contains comprehensive Jest tests for the backend models of the Social Media Application.

## Test Structure

### Model Tests
- `user.model.test.js` - Tests for User model validation, creation, and business logic
- `post.model.test.js` - Tests for Post model validation, creation, and features
- `comment.model.test.js` - Tests for Comment model validation and functionality
- `integration.test.js` - Tests for model relationships and complex queries

### Setup Files
- `setup.js` - Global test configuration and setup
- `README.md` - This documentation file

## Running Tests

### Prerequisites
Make sure you have installed the required dependencies:
```bash
bun add -D jest @babel/core @babel/preset-env babel-jest sqlite3 supertest
```

### Test Commands

```bash
# Run all tests
bun run test

# Run tests in watch mode
bun run test:watch

# Run tests with coverage report
bun run test:coverage

# Run specific test file
bun run test user.model.test.js

# Run tests matching a pattern
bun run test --testNamePattern="User Creation"
```

## Test Coverage

### User Model Tests
- ✅ User creation with valid data
- ✅ Email normalization (lowercase conversion)
- ✅ Default values assignment
- ✅ Validation for required fields
- ✅ Email format validation
- ✅ Username length validation (3-30 characters)
- ✅ Password length validation (6-255 characters)
- ✅ Full name length validation (3-100 characters)
- ✅ Website URL validation
- ✅ Age validation (minimum 13 years old)
- ✅ Role validation (user/admin)
- ✅ Unique constraints (username, email)

### Post Model Tests
- ✅ Post creation with required fields
- ✅ Post creation with optional fields
- ✅ Poll functionality testing
- ✅ Content length validation (1-100 characters)
- ✅ Required field validation (userId, content)
- ✅ Default values (backgroundColor, pollActive)
- ✅ Post updates and modifications
- ✅ Timestamp functionality

### Comment Model Tests
- ✅ Comment creation with valid data
- ✅ Content length validation (1-100 characters)
- ✅ Required field validation (postId, userId, content)
- ✅ Foreign key relationships
- ✅ Comment updates
- ✅ Timestamp functionality
- ✅ UUID generation
- ✅ Bulk operations
- ✅ Query operations

### Integration Tests
- ✅ User-Post relationships
- ✅ Post-Comment relationships
- ✅ Complex nested queries
- ✅ Multiple user interactions
- ✅ Foreign key constraints
- ✅ Data integrity
- ✅ Transaction handling
- ✅ Cascade operations

## Test Database

Tests use SQLite in-memory database for:
- Fast execution
- Isolation between tests
- No external dependencies
- Automatic cleanup

## Test Patterns

### Describe Blocks
- Model-level grouping
- Feature-level grouping
- Validation grouping
- Relationship grouping

### Test Lifecycle
- `beforeAll`: Database setup and model definition
- `afterAll`: Database cleanup
- `beforeEach`: Clear test data between tests
- `afterEach`: Additional cleanup if needed

### Assertions
- Positive test cases (valid data)
- Negative test cases (invalid data)
- Edge cases (boundary values)
- Error handling
- Data integrity checks

## Best Practices

1. **Isolation**: Each test is independent
2. **Cleanup**: Database is cleared between tests
3. **Descriptive Names**: Test names clearly describe what is being tested
4. **Comprehensive Coverage**: Both happy path and error cases
5. **Real-world Scenarios**: Tests reflect actual usage patterns

## Adding New Tests

When adding new model tests:

1. Create a new test file in `__tests__/models/`
2. Follow the existing pattern:
   ```javascript
   import { YourModel } from '../../src/models/your.model.js';
   import { Sequelize } from 'sequelize';
   
   describe('YourModel Model', () => {
     // Test setup
     // Test cases
   });
   ```
3. Include validation tests
4. Include relationship tests if applicable
5. Update this README with new test coverage

## Troubleshooting

### Common Issues

1. **Module Import Errors**: Ensure Babel is configured correctly
2. **Database Connection**: Check SQLite3 installation
3. **Timeout Issues**: Increase timeout in Jest config if needed
4. **Memory Issues**: Tests use in-memory database, should be lightweight

### Debug Mode

To run tests with debug output:
```bash
DEBUG=* bun run test
```

### Verbose Output

For detailed test output:
```bash
bun run test --verbose
```

## Coverage Reports

Coverage reports are generated in the `coverage/` directory:
- `coverage/lcov-report/index.html` - HTML coverage report
- `coverage/lcov.info` - LCOV format for CI/CD
- Console output shows coverage summary

## CI/CD Integration

These tests are designed to run in CI/CD pipelines:
- No external dependencies
- Fast execution
- Comprehensive coverage
- Clear pass/fail indicators