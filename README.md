# Absence Management

A React application for managing and viewing employee absences with conflict detection.

## Features

- 📋 View all employee absences in a sortable, filterable table
- 🔍 Filter absences by employee name
- ⬆️ Sort by employee name, start date, end date, days, or absence type
- ✅ Visual indicators for approval status (Approved/Pending badges)
- ⚠️ Conflict detection with lazy-loaded status per absence
- 📄 Multiple pagination styles (Show More, Next/Prev, Page Numbers)
- 🎨 Responsive UI with Tailwind CSS

## Tech Stack

- **React 19** with TypeScript
- **Vite 7** for development and bundling
- **React Query (TanStack Query)** for data fetching, caching, and server state management
- **Tailwind CSS 4** for styling
- **Lucide React** for icons
- **date-fns** for date manipulation
- **Jest 30** + **React Testing Library** for testing

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
│   ├── AbsencesTable/           # Main absences table with conflict detection
│   │   └── FilteringByUserBanner/  # Banner shown when filtering by user
│   ├── Table/                   # Reusable table component
│   │   ├── pagination/          # Pagination controls
│   │   ├── SortIcon/            # Sort direction indicator
│   │   ├── TableFilters/        # Column filtering UI
│   │   ├── TableSkeleton/       # Loading skeleton
│   │   └── useTableLogic.ts     # Table state management hook
│   ├── Container/               # Layout container
│   ├── Header/                  # App header
│   ├── Badge.tsx                # Status badges
│   ├── Button.tsx               # Button component
│   ├── Skeleton.tsx             # Loading skeleton primitive
│   ├── Spinner.tsx              # Loading spinner
│   └── Tooltip.tsx              # Tooltip component
├── hooks/
│   └── useAbsencesTable/        # Absences data fetching & filtering
├── services/
│   ├── getAbsences/             # Fetch absences API
│   └── getAbsenceConflict/      # Fetch conflict status API
├── utils/
│   ├── formatAbsences/          # Transform API data
│   ├── formatDate/              # Date formatting
│   ├── getFilteredAbsences/     # Filter absences by criteria
│   └── parseDate/               # Date parsing utilities
├── lib/
│   └── utils.ts                 # Utility functions (cn, etc.)
└── types.ts                     # TypeScript type definitions
```

## Testing

The project includes unit tests for components and utilities:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch
```

Test files are co-located with their source files (e.g., `test.tsx` or `test.ts`).

## API Endpoints

The app expects the following endpoints:

| Endpoint                   | Method | Description                       |
| -------------------------- | ------ | --------------------------------- |
| `GET /absences`            | GET    | Fetch all absences                |
| `GET /conflict/:absenceId` | GET    | Check if an absence has conflicts |

## License

Private

