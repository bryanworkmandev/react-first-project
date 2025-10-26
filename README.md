# Service Request System

A React + TypeScript real-time service request application that enables communication between internal and external users. The app features role-based form editing, real-time notifications via Ably, and a complete workflow for service request management with modern component styling using SCSS and Material UI.

## Features

- **Real-time Communication**: Live notifications between internal and external users via Ably
- **Role-based Form Editing**: Different form capabilities based on user role (internal vs external)
- **Service Request Workflow**: Complete workflow from request creation to completion
- **Real-time Notifications**: Material-UI Snackbar notifications with detailed request information
- **Dynamic Form Sections**: Scheduling, deliverables, notes, and contact information
- **Form Pre-population**: Notifications can load existing data into the form for editing
- **Responsive Design**: Mobile-friendly layout with semantic markup and accessibility features

## Getting Started

### Prerequisites

- Node.js 18+
- `npm` 8+

### Install & Run

```bash
npm install
npm run dev
```

The Vite dev server launches on `http://localhost:5173` by default.

### Available Scripts

- `npm run dev` – start the Vite development server with HMR
- `npm run build` – type-check with `tsc` and build the production bundle
- `npm run preview` – preview the production build locally
- `npm run lint` – run ESLint across the project
- `npm test` – run tests with Vitest
- `npm run test:ui` – run tests with Vitest UI
- `npm run test:run` – run tests once (CI mode)

## Project Structure

```text
src/
├── App.tsx              # Root layout with AblyProvider and role management
├── App.scss             # Global shell styling
├── ably.ts              # Ably configuration and real-time setup
├── components/
│   ├── topbar/          # Role switcher and header display
│   │   ├── topbar.tsx
│   │   ├── topbar.scss
│   │   ├── role_options.ts
│   │   └── components/basic_select/
│   │       ├── basic_select.tsx
│   │       └── basic_select.scss
│   └── order_form/      # Service request form system
│       ├── order_form.tsx
│       ├── order_form.scss
│       ├── constants/
│       │   └── constants.ts    # Form data types and options
│       ├── services/
│       │   └── ablyService.ts  # Ably real-time communication service
│       └── components/
│           ├── notifications/
│           │   ├── notifications.tsx
│           │   └── notifications.scss
│           ├── service_request_form/
│           │   ├── service_request_form.tsx
│           │   └── service_request_form.scss
│           └── deliverables_and_notes/
│               └── deliverables_and_notes.tsx
├── scss_variables/
│   └── variables.scss   # Shared SCSS variables
├── test/
│   ├── setup.ts         # Test environment setup
│   └── test-utils.tsx   # Custom test utilities
├── services/
│   └── ablyService.ts   # Ably real-time communication service
├── index.scss           # Base styles and CSS variables
└── main.tsx             # Application bootstrap
```

## Real-time Communication Setup

This application uses Ably for real-time communication between internal and external users. The system enables live notifications and form data synchronization.

### How It Works

1. **Internal User** fills out and submits a service request form
2. **External User** receives a real-time notification about the new request
3. **External User** can click the notification to open the form with pre-populated data
4. **External User** completes the work by filling out deliverables & notes and submitting
5. **Internal User** receives a real-time notification that the service request is completed

### Testing the System

1. Open the application in two browser windows/tabs
2. Set one window to "Internal User" and the other to "External User"
3. In the Internal User window, fill out and submit the service request form
4. Check the External User window - you should see a notification appear
5. Click "Open Form" in the notification to see the pre-populated form
6. Complete the deliverable checkboxes and add notes in the External User window
7. Submit the form as the External User
8. Check the Internal User window - you should see a completion notification

For detailed Ably setup information, see [ABLY_SETUP.md](./ABLY_SETUP.md).

## Testing

The project includes comprehensive test coverage using Vitest and React Testing Library:

- **43 tests** across 7 test files
- **Component testing** for all major UI components
- **User interaction testing** with userEvent
- **Mocking** for Ably services and external dependencies
- **TypeScript support** with proper type checking in tests

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once (CI mode)
npm run test:run

# Run tests with UI
npm run test:ui
```

## Implementation Notes

- React 19 with the modern compiler-ready JSX runtime
- Ably real-time messaging for live notifications and data synchronization
- Material UI components for accessible select controls and notifications
- TypeScript types for form data, Ably messages, and option lists ensure type safety
- SCSS modules for component-scoped styling with shared variables in `src/scss_variables/`
- Form state managed with React hooks (`useState`, `useMemo`, `useCallback`, `useEffect`)
- Role-based form editing with different capabilities for internal vs external users
- Comprehensive test suite with Vitest and React Testing Library

## Dependencies

- **React 19** - Modern React with compiler-ready JSX runtime
- **TypeScript** - Type safety and enhanced developer experience
- **Vite** - Fast build tool and development server
- **Material UI** - Accessible UI components and theming
- **Ably** - Real-time messaging and communication
- **SCSS** - Enhanced CSS with variables and nesting
- **Vitest** - Fast unit testing framework
- **React Testing Library** - Simple and complete testing utilities
- **Jest DOM** - Custom Jest matchers for DOM testing

## Next Steps

- Add data persistence (e.g., API integration or local storage)
- Implement user authentication and authorization
- Add request history and tracking features
- Implement file uploads for deliverables
- Add email notifications as a fallback
- Expand test coverage for edge cases and error handling
- Add integration tests for the complete user workflow

## License

This project is for interview preparation and internal demos. No license has been assigned.
