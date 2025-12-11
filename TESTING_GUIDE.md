# Testing Guide

## Overview

This project uses **Jest** and **React Testing Library** for unit and integration testing.

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Testing Philosophy

### What to Test ✅

- **User-visible behavior**: What users see and interact with
- **User interactions**: Clicks, typing, form submissions
- **Component states**: Loading, error, success states
- **Accessibility**: ARIA attributes, keyboard navigation
- **Error handling**: How components handle failures

### What NOT to Test ❌

- Implementation details (internal state, private methods)
- Third-party library internals
- Styles (CSS)
- Static content that doesn't change

## Testing Structure (AAA Pattern)

```typescript
it('describes what the test does', async () => {
  // 1. ARRANGE: Set up test data and render component
  render(<MyComponent />);

  // 2. ACT: Perform user actions
  const button = screen.getByRole('button');
  await user.click(button);

  // 3. ASSERT: Verify expected outcomes
  expect(screen.getByText('Success!')).toBeInTheDocument();
});
```

## Common Patterns

### 1. Finding Elements (Queries)

```typescript
// By role (preferred - most accessible)
screen.getByRole('button', { name: /submit/i });
screen.getByRole('textbox', { name: /email/i });

// By text content
screen.getByText('Hello World');

// By label (for form inputs)
screen.getByLabelText('Email Address');

// By test ID (last resort)
screen.getByTestId('custom-element');
```

### 2. User Interactions

```typescript
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();

// Click
await user.click(button);

// Type
await user.type(input, 'hello@example.com');

// Clear and type
await user.clear(input);
await user.type(input, 'new value');
```

### 3. Async Testing

```typescript
// Wait for element to appear
await waitFor(() => {
  expect(screen.getByText('Data loaded')).toBeInTheDocument();
});

// Or use findBy (built-in waiting)
const element = await screen.findByText('Data loaded');
```

### 4. Mocking External Dependencies

```typescript
// Mock API service
jest.mock('./service/apiService', () => ({
  apiService: {
    fetchData: jest.fn(),
  },
}));

// Mock Next.js components
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));
```

## Example Tests

### Simple Rendering Test

```typescript
it('renders component with title', () => {
  render(<Header />);
  expect(screen.getByText('My App')).toBeInTheDocument();
});
```

### User Interaction Test

```typescript
it('toggles menu when button is clicked', async () => {
  const user = userEvent.setup();
  render(<Header />);

  const button = screen.getByRole('button', { name: /menu/i });

  await user.click(button);
  expect(button).toHaveAttribute('aria-expanded', 'true');
});
```

### API Integration Test

```typescript
it('loads and displays data from API', async () => {
  mockApiService.fetchData.mockResolvedValue({
    success: true,
    data: [{ id: 1, name: 'Item 1' }],
  });

  render(<ProductList />);

  await waitFor(() => {
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });
});
```

## Tips

1. **Test user behavior, not implementation**

   - ❌ `expect(component.state.isOpen).toBe(true)`
   - ✅ `expect(button).toHaveAttribute('aria-expanded', 'true')`

2. **Use accessible queries**

   - Prefer `getByRole` over `getByTestId`
   - This ensures your component is accessible

3. **Keep tests simple and focused**

   - One test should verify one behavior
   - Tests should be easy to read and understand

4. **Clean up after tests**
   - Use `beforeEach`/`afterEach` for setup/teardown
   - Reset mocks: `jest.clearAllMocks()`

## Test File Structure

```
src/
  app/
    blocks/
      header/
        header.tsx
        header.css
        __tests__/
          header.test.tsx  ← Tests here
```

## Coverage Goals

Aim for:

- **80%+ line coverage** for critical components
- **100% coverage** for utility functions
- Focus on quality over quantity

Run `npm run test:coverage` to see coverage report.

## Resources

- [React Testing Library Docs](https://testing-library.com/react)
- [Jest Docs](https://jestjs.io/)
- [Testing Library Queries Cheatsheet](https://testing-library.com/docs/queries/about)
