# Testing


## Key Objectives:
-  Verify functionality works as expected
-  Find and fix bugs early
-  Ensure code quality and maintainability
-  Prevent regressions (old bugs coming back)
-  Document expected behavior
-  Enable safe refactoring

---

## Testing Pyramid

The testing pyramid is a strategy that shows how many tests of each type you should write:

```
                                   /\
                                  /  \     E2E/UI Tests
                                 / 3% \    (Few - Slow - Expensive)
                                /______\   _________________________
                               /        \  
                              /          \    Integration Tests
                             /    20%     \   (Some - Medium Speed)
                            /______________\   _____________________ 
                           /                \
                          /      70%         \    Unit Tests
                         /____________________\   (Many - Fast - Cheap)
```

### Why This Shape?

**Many Unit Tests (Base)**
- Fast to run (milliseconds)
- Easy to write and maintain
- Pinpoint exact failures
- Run frequently during development

**Some Integration Tests (Middle)**
- Test modules working together
- Catch interface issues
- Slower than unit tests
- More realistic scenarios

**Few E2E Tests (Top)**
- Test critical user journeys only
- Slow and fragile
- Expensive to maintain
- Most realistic but least reliable

---

## Types of Tests

### 1. **Unit Tests**

**What:** Test individual functions, methods, or classes in isolation.

**Characteristics:**
- Test one thing at a time
- Fast execution (milliseconds)
- No external dependencies (database, API, file system)
- Use mocking for dependencies
- High code coverage possible


### 2. **Integration Tests**

**What:** Test how multiple units work together.

**Characteristics:**
- Test interactions between components
- May involve real dependencies (database, external services)
- Slower than unit tests
- Test data flow between modules

---

### 3. **End-to-End (E2E) Tests**

**What:** Test the entire application from the user's perspective.

**Characteristics:**
- Test complete user workflows
- Use real browser and real backend
- Slowest tests (seconds to minutes)
- Most fragile (many points of failure)
- Most realistic

---

### 4. **Functional Tests**

**What:** Test specific functionality or features (often overlaps with integration tests).

**Characteristics:**
- Focus on "does this feature work?"
- Test from external interface (API, UI)
- Black-box testing approach
- Test expected outcomes

---

### 5. **Regression Tests**

**What:** Tests that ensure old bugs don't come back.

**Characteristics:**
- Written after fixing a bug
- Ensures the bug stays fixed
- Often automated
- Run with every change

**When to Use:**
- After fixing any bug
- Before major releases
- During refactoring

---

### 6. **Performance Tests**

**What:** Test how fast and efficiently the application runs.

**Types:**
- **Load Testing** - Test with expected user load
- **Stress Testing** - Test beyond normal capacity
- **Spike Testing** - Test sudden traffic increases
- **Endurance Testing** - Test over extended periods

---

### 7. **Security Tests**

**What:** Test for security vulnerabilities.

**Common Tests:**
- SQL injection attempts
- XSS (Cross-Site Scripting) protection
- CSRF token validation
- Authentication and authorization
- Password strength requirements
- Rate limiting

---

## Testing Best Practices

### General Principles:

#### 1. **Write Tests First (TDD - Test-Driven Development)**
```
1. Write a failing test
2. Write minimal code to make it pass
3. Refactor
4. Repeat
```

**Benefits:**
- Better code design
- Complete test coverage
- Tests document requirements

#### 2. **Keep Tests Simple and Focused**
```javascript
// ❌ Bad: Testing too much at once
test('user management', () => {
  // Creates user
  // Updates user
  // Deletes user
  // Lists users
  // All in one test!
});

// ✅ Good: One concept per test
test('creates user with valid data', () => { ... });
test('updates user email', () => { ... });
test('deletes user', () => { ... });
test('lists all users', () => { ... });
```

#### 3. **Follow AAA Pattern**
**Arrange-Act-Assert:**
```javascript
test('adds item to cart', () => {
  // Arrange: Setup
  const cart = new ShoppingCart();
  const item = { id: 1, name: 'Book', price: 10 };
  
  // Act: Execute
  cart.addItem(item);
  
  // Assert: Verify
  expect(cart.items).toHaveLength(1);
  expect(cart.total).toBe(10);
});
```

#### 4. **Use Descriptive Test Names**
```javascript
// ❌ Bad
test('user test', () => { ... });

// ✅ Good
test('calculates discount correctly for premium users', () => { ... });
```

#### 5. **Test Behavior, Not Implementation**
```javascript
// ❌ Bad: Testing implementation details
test('calls internal helper method', () => {
  const spy = jest.spyOn(obj, '_internalMethod');
  obj.doSomething();
  expect(spy).toHaveBeenCalled();
});

// ✅ Good: Testing behavior
test('returns correct result', () => {
  const result = obj.doSomething();
  expect(result).toBe(expectedValue);
});
```

#### 6. **Keep Tests Independent**
```javascript
// ❌ Bad: Tests depend on each other
let user;
test('creates user', () => {
  user = createUser(); // Sets global variable
});
test('updates user', () => {
  updateUser(user); // Depends on previous test
});

// ✅ Good: Each test is independent
test('creates user', () => {
  const user = createUser();
  expect(user).toBeDefined();
});
test('updates user', () => {
  const user = createUser(); // Creates own data
  updateUser(user);
  expect(user.updated).toBe(true);
});
```

#### 7. **Use Test Fixtures and Factories**
```javascript
// Create reusable test data
function createTestUser(overrides = {}) {
  return {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
    ...overrides
  };
}

test('admin can delete users', () => {
  const admin = createTestUser({ role: 'admin' });
  const user = createTestUser({ id: 2 });
  // ...
});
```

#### 8. **Mock External Dependencies**
```javascript
// Mock API calls
jest.mock('./api', () => ({
  fetchUser: jest.fn(() => Promise.resolve({ id: 1, name: 'Test' }))
}));

test('displays user data', async () => {
  render(<UserProfile userId={1} />);
  await waitFor(() => {
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

#### 9. **Test Edge Cases and Error Conditions**
```javascript
test('handles empty array', () => { ... });
test('handles null input', () => { ... });
test('handles network error', () => { ... });
test('handles invalid data format', () => { ... });
```

---

## Test Coverage

**Test coverage** measures how much of your code is executed during tests.

### Common Metrics:
- **Line Coverage** - % of lines executed
- **Branch Coverage** - % of conditional branches tested
- **Function Coverage** - % of functions called
- **Statement Coverage** - % of statements executed

### What's a Good Coverage Percentage?

- **70-80%** - Good baseline for most projects
- **80-90%** - Great coverage
- **90%+** - Excellent (but diminishing returns)
- **100%** - Usually unnecessary and expensive

**Important:** High coverage ≠ Good tests!
- Coverage shows what was executed, not what was tested
- Focus on testing critical paths and edge cases
- Quality over quantity

---

## Testing Anti-Patterns to Avoid

### 1. **Testing Implementation Details**
Tests break when you refactor, even though behavior is the same.

### 2. **Flaky Tests**
Tests that sometimes pass and sometimes fail (often due to timing issues).

### 3. **Slow Tests**
Tests that take too long discourage running them frequently.

### 4. **Brittle Tests**
Tests that break easily with small changes.

### 5. **Test Interdependence**
Tests that rely on other tests running first.

### 6. **Too Many Mocks**
Over-mocking means you're not testing real behavior.

### 7. **Testing Everything**
Wasting time testing trivial code or third-party libraries.

### 8. **No Test Maintenance**
Letting tests rot when they fail instead of fixing them.
