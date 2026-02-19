# Absence Management

A React application for managing and viewing employee absences with conflict detection.

## Features

- View all employee absences in a sortable table
- Filter absences by employee
- Sort by employee name, start date, end date, days, or absence type
- Visual indicators for approval status (Approved/Pending)
- Conflict detection with lazy-loaded status per absence
- Responsive UI with Tailwind CSS

## Tech Stack

- **React 19** with TypeScript
- **Vite** for development and bundling
- **React Query** for data fetching, caching, and server state management
- **Tailwind CSS 4** for styling
- **Shadcn UI** for component library and theming
- **Radix UI** for accessible primitives
- **date-fns** for date manipulation
- **Jest** + **React Testing Library** for testing

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://your-api-url/
```

## Scripts

| Command              | Description              |
| -------------------- | ------------------------ |
| `npm run dev`        | Start development server |
| `npm run build`      | Build for production     |
| `npm run preview`    | Preview production build |
| `npm run lint`       | Run ESLint               |
| `npm run test`       | Run tests                |
| `npm run test:watch` | Run tests in watch mode  |

## Project Structure

```
src/
├── components/
│   ├── AbsencesTable/       # Main table component
│   │   ├── FilteringByUserBanner/
│   │   ├── TableContent/
│   │   │   ├── TableHeader/
│   │   │   └── TableRow/
│   │   │       └── ConflictTooltip/
│   │   └── TableTitle/
│   ├── Container/
│   ├── Header/
│   └── ui/                  # Reusable UI components (shadcn)
├── hooks/
│   ├── useAbsences/         # Absences data fetching (React Query)
│   ├── useAbsencesTable/    # Table state management
│   ├── useConflict/         # Per-row conflict fetching (React Query)
│   └── useSortTable/        # Sorting & filtering logic
├── services/
│   ├── getAbsences/         # Fetch absences API
│   └── getAbsenceConflict/  # Fetch conflict status API
├── utils/
│   ├── formatAbsences/      # Transform API data
│   └── parseDate/           # Date parsing utilities
└── types.ts                 # TypeScript type definitions
```

## Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run a specific test file
npm run test:watch src/hooks/useConflict/test.ts
```

## API Endpoints

The app expects the following endpoints:

| Endpoint                   | Method | Description                       |
| -------------------------- | ------ | --------------------------------- |
| `GET /absences`            | GET    | Fetch all absences                |
| `GET /conflict/:absenceId` | GET    | Check if an absence has conflicts |

## License

Private
