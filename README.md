# Look Request Prototype

A React + TypeScript single-page prototype for creating WeGoLook internal look requests. The app demonstrates role-based UI controls, a dynamic look request form, and modern component styling using SCSS and Material UI.

## Features

- Topbar role switcher built with Material UI `Select` and custom styling
- Internal user workflow with a fully validated look request form
- Dynamic sections for scheduling, deliverables, and internal routing
- Submission preview panel that mirrors form state for quick review
- Responsive layout with semantic markup and ARIA hints for accessibility

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

## Project Structure

```text
src/
├── App.tsx              # Root layout that wires the topbar and form
├── App.scss             # Global shell styling
├── components/
│   ├── topbar/          # Role switcher and header display
│   │   ├── topbar.tsx
│   │   ├── topbar.scss
│   │   └── components/basic_select/
│   │       ├── basic_select.tsx
│   │       └── basic_select.scss
│   └── order_form/      # Internal look request form
│       ├── order_form.tsx
│       └── order_form.scss
├── index.scss           # Base styles and CSS variables
└── main.tsx             # Application bootstrap
```

## Implementation Notes

- React 19 with the modern compiler-ready JSX runtime
- Material UI components for accessible select controls
- TypeScript types for form data and option lists ensure type safety
- SCSS modules for component-scoped styling with shared variables in `src/scss_variables/`
- Form state managed with React hooks (`useState`, `useMemo`, `useCallback`, `useEffect`)

## Next Steps

- Extend role support to external and partner flows
- Add data persistence (e.g., API integration or local storage)
- Layer in automated tests with Vitest and React Testing Library
- Incorporate field-level validation messaging

## License

This project is for interview preparation and internal demos. No license has been assigned.
