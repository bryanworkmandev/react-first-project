# Testing Guide

This project uses **Vitest** and **React Testing Library** for comprehensive testing.

## Test Structure

```
src/
├── test/
│   ├── setup.ts                    # Test setup and global configuration
│   ├── test-utils.tsx              # Custom render utilities
│   └── __mocks__/                  # Mock implementations
│       ├── ably.ts                 # Ably client mocks
│       └── services/
│           └── ablyService.ts      # Ably service mocks
├── components/
│   ├── App.test.tsx                # Main app component tests
│   ├── topbar/
│   │   ├── topbar.test.tsx         # Topbar component tests
│   │   └── components/
│   │       └── basic_select/
│   │           └── basic_select.test.tsx
│   └── order_form/
│       ├── order_form.test.tsx     # Order form container tests
│       └── components/
│           ├── notifications/
│           │   └── notifications.test.tsx
│           ├── service_request_form/
│           │   └── service_request_form.test.tsx
│           └── deliverables_and_notes/
│               └── deliverables_and_notes.test.tsx
├── services/
│   └── ablyService.test.ts         # Ably service tests
├── components/order_form/constants/
│   └── constants.test.ts           # Constants and utility tests
└── integration/
    └── workflow.test.tsx           # End-to-end workflow tests
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test

# Run tests once and exit
npm run test:run

# Run tests with UI
npm run test:ui
```

## Test Categories

### 1. Unit Tests
- **Component Tests**: Test individual React components in isolation
- **Service Tests**: Test business logic and API interactions
- **Utility Tests**: Test helper functions and constants

### 2. Integration Tests
- **Workflow Tests**: Test complete user journeys
- **Component Integration**: Test how components work together

## Test Coverage

The test suite covers:

- ✅ **Component Rendering**: All components render without errors
- ✅ **User Interactions**: Form submissions, button clicks, role switching
- ✅ **State Management**: Form state, role state, notification state
- ✅ **Service Integration**: Ably service calls and subscriptions
- ✅ **Validation**: Form validation and error handling
- ✅ **Accessibility**: ARIA labels and keyboard navigation
- ✅ **Responsive Design**: Mobile and desktop layouts

## Mock Strategy

### Ably Service Mocking
```typescript
// Mock the Ably client and service
vi.mock('../ably', () => ({
  client: { channels: { get: vi.fn() } },
  AblyProvider: ({ children }) => children
}))

vi.mock('../services/ablyService', () => ({
  ablyService: {
    publishNewRequest: vi.fn(),
    publishCompletion: vi.fn(),
    subscribeToNewRequests: vi.fn(),
    subscribeToCompletions: vi.fn(),
    unsubscribe: vi.fn()
  }
}))
```

### Component Mocking
```typescript
// Mock child components for focused testing
vi.mock('./child-component', () => ({
  default: ({ prop1, prop2 }) => (
    <div data-testid="mocked-component" data-prop1={prop1}>
      {prop2}
    </div>
  )
}))
```

## Testing Best Practices

### 1. Test Structure
```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render correctly', () => {
    // Arrange
    const props = { /* test props */ }
    
    // Act
    render(<ComponentName {...props} />)
    
    // Assert
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

### 2. User Interactions
```typescript
it('should handle user input', async () => {
  const user = userEvent.setup()
  render(<FormComponent />)
  
  await user.type(screen.getByLabelText('Name'), 'John Doe')
  await user.click(screen.getByRole('button', { name: 'Submit' }))
  
  expect(mockOnSubmit).toHaveBeenCalledWith({ name: 'John Doe' })
})
```

### 3. Async Operations
```typescript
it('should handle async operations', async () => {
  render(<AsyncComponent />)
  
  await waitFor(() => {
    expect(screen.getByText('Loaded Content')).toBeInTheDocument()
  })
})
```

## Test Data

### Sample Test Data
```typescript
const mockServiceRequestData = {
  id: '123',
  requestTitle: 'Test Request',
  serviceType: 'site_inspection',
  priority: 'high',
  clientAccount: 'Test Client',
  // ... other fields
}
```

## Continuous Integration

Tests run automatically on:
- Pull requests
- Main branch pushes
- Pre-commit hooks (if configured)

## Debugging Tests

### 1. Debug Mode
```bash
# Run specific test file
npm test -- src/components/App.test.tsx

# Run tests matching pattern
npm test -- --grep "should render"
```

### 2. Visual Debugging
```typescript
// Print DOM structure
screen.debug()

// Print specific element
screen.debug(screen.getByRole('button'))
```

### 3. Test UI
```bash
npm run test:ui
```

## Adding New Tests

1. **Create test file**: `ComponentName.test.tsx`
2. **Import dependencies**: Testing library, component, mocks
3. **Write test cases**: Follow the structure above
4. **Mock external dependencies**: Services, child components
5. **Test user interactions**: Clicks, typing, form submissions
6. **Test edge cases**: Error states, empty data, validation

## Performance Testing

For performance testing, consider:
- Component render times
- Memory usage
- Bundle size impact
- User interaction responsiveness

## Accessibility Testing

All tests should verify:
- Proper ARIA labels
- Keyboard navigation
- Screen reader compatibility
- Focus management
