# Absence Management

A React application for managing and viewing employee absences with conflict detection.

## Features

- 📋 View all employee absences in a sortable, filterable table
- 🔍 Filter absences by employee name
- ⬆️ Sort by employee name, start date, end date, days, or absence type
- ✅ Visual indicators for approval status (Approved/Pending badges)
- ⚠️ Conflict detection with lazy-loaded status per absence
- 📄 Pagination (Page Numbers)
- 🎨 Responsive UI with Tailwind CSS

## Tech Stack

- **React 19** with TypeScript
- **Vite 7** for development and bundling
- **React Query (TanStack Query)** for data fetching, caching, and server state management
- **Tailwind CSS 4** for styling
- **Lucide React** for icons
- **date-fns** for date manipulation
- **Jest 30** + **React Testing Library** for testing

## Future Improvements / What I'd Add Given More Time

- **E2E Tests**: Would add Playwright tests for full user journeys
- **Backend Pagination**: Currently all data is loaded client-side. With API support, would move to server-side pagination
- **Batch Conflict API**: Currently N+1 queries for conflicts. Would request a batch endpoint or implement virtual scrolling to mitigate
- **Accessibility Audit**: While semantic HTML is used, a full a11y audit with screen readers would be beneficial

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

Create a `.env` file in the project root (or copy `.env.example`):

```env
VITE_API_URL=https://front-end-kata.brighthr.workers.dev/api/
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
│   │   ├── AbsenceConflictTooltip/  # Lazy-loaded conflict indicator
│   │   └── FilteringByUserBanner/   # Banner shown when filtering by user
│   ├── Table/                   # Reusable table component
│   │   └── TableSkeleton/       # Loading skeleton
│   ├── pagination/              # Pagination controls
│   ├── SortIcon/                # Sort direction indicator
│   ├── Container/               # Layout container
│   ├── Header/                  # App header
│   └── ui/                      # Reusable UI primitives
│       ├── Badge.tsx            # Status badges
│       ├── Button/              # Button component
│       ├── Skeleton.tsx         # Loading skeleton primitive
│       ├── Spinner.tsx          # Loading spinner
│       └── Tooltip/             # Tooltip component
├── hooks/
│   └── useAbsencesTable/        # Absences data fetching, filtering, sorting & pagination
├── services/
│   ├── getAbsences/             # Fetch absences API
│   └── getAbsenceConflict/      # Fetch conflict status API
├── utils/
│   ├── formatAbsences/          # Transform API data
│   ├── formatDate/              # Date formatting
│   ├── getFilteredAbsences/     # Filter absences by user
│   ├── mapAbsencesToTableData/  # Map absences to table format
│   ├── paginateData/            # Generic pagination utility
│   ├── parseDate/               # Date parsing utilities
│   └── sortAbsences/            # Sort absences by field
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
