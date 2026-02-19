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
│   ├── useAbsencesTable/    # Table data fetching & state (React Query)
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

## Why Vite + React instead of Next.js?

### No SEO requirements:

As this is a client-side dashboard app, there is no need for SEO. Server-side rendering with Next.js would mean that the user visits the page, server runs the codes and builds the HTML with the data already inside it, then returns it to the user as a complete page. Client-side rendering with Vite + React means that the user visits the page, is met with an empty HTML file and javascript files. Javascript runs in the user's browser and fetches data from the API and builds the page. Next.js would be better for web crawlers as React requires the crawlers to wait for the javascript to run and populate the HTML, however as the Absence Management feature would be part of an authentication protected dashboard, there is no need for the SEO benefit Next.js brings.

### No complex routing:

This is a single page application, which is perfectly sufficient for Vite + React. Even if there were multiple routes, React Router would be the first preference - as opposed to jumping straight to Next.js. Next.js is great for dealing with 50+ routes that require handling of parallel (e.g. a dashboard showing multiple pages/sections within view, each with their own navigation) and intercepting routes (staying on the current page with new content appearing on top as a modal).

### Next.js adds additional unnecessary complexity:

With Next.js, you are consistently having to decide whether a component is rendered on the server or the browser. In order to use react hooks, you must add "use client" at the top of the document. With Next.js, you also have to deal with hydration warnings - where the server HTML doesn't match the HTML rendered with React on the client (common causes being Date.now(), Math.random()) However, with Vite + React, everything runs on the browser so everything is simplified. Everything is "use client" by default and everything is rendered on the browser - so no hydration errors.

Vite + React is also more simple to deploy - it deals with static files, so can be uploaded anywhere (e.g. Github Pages, Netlify). Next.js deals with a Node.js application that needs a server to run - so can only be deployed to Vercel, your own Node server or docker.

### Vite + React offers faster development:

Next.js is also slower to develop on. Vite starts in ~300ms and has instant hot reload. Next.js starts in 2-5 seconds and has a slower hot reload. This is because with Vite, you save a file, Vite sends only that saved file to the browser and the browser updates instantly (~50ms). But with Next.js, you save a file. Next.js reads it, checks if the file is used on the server - if so, it recompiles (transforms/converts JSX and typescript to javascript) the server bundle (javascript files squashed into one or a few files) and sends it to the browser. Then it checks if the file is used on the client, and goes through the same process. With Vite, there is no bundling and no recompiling. If this was a restaurant and you asked the Chef to change an ingredient, with Vite + React, the chef would swap out just that ingredient, but with Next.js, the chef would remake the entire meal.

## Why use React Query?

At first, I chose not to use React Query as I did not feel it was necessary for a one page application with no where else to navigate to and no pagination - the only API calls are made on first page render. However, I chose to implement React Query in the end to simplify loading and error states and remove the need to store and set them manually in React useStates. Using React Query also allows me to add a retry button in the event that fetching absences fail with the use of React Query's refetch function - if that was a feature that users would want. Using React Query also makes this project scalable. If pagination/page-number was introduced in the future as a backend payload option, then the page number could easily be passed as a queryKey - allowing the user to cache previous pages of absences and return to them without waiting for repeated API calls. If other pages were introduced to the project, then caching would allow them to navigate to other routes and return to Absences Management page without a fresh API call.

## Why custom hooks and prop-drilling instead of state management libraries (e.g. Zustand, React Context)?

For the small scope of this feature, built-in state and custom hooks are sufficient. The cost of the extra engineering of introducing state management would be more appropriate for a larger project where cross-component state sharing becomes un-sustainable.

I chose to use prop drilling as opposed to other methods of state management. This is because Props are only being drilled 3 levels max which is still easy to trace and does not require significant changes if prop names change etc. It also prevents the need for an additional external package - where changes to the package or deprecation could affect the project without my knowledge or control, a risk when taking on external packages. However, if the scope of the project was larger, I would explore options such as colocating state (keeping states as close as possible to where they are being used), or I would move the state to a context provider if the component receiving the drilled prop can exist independently outside of its parent. As a last resort, if the previous options were not enough, I would use React Context and create a provider where children within the provider can use the returned values.

Although it is tempting to use an external package, such as Zustand, I believe React has enough tools to be able to deal with state management without the need to install an external package that could become deprecated and require a significant amount of time spent on clearing tech debt - e.g. in BrightHR, Lodash and eventually Formik.

## How could performance be improved?

Whether an absence has a conflict should ideally be included as a boolean on the fetch absences, rather than being a separate endpoint we have to call again for each absence. Or there could be a batch endpoint where an array of absence-ids can be passed and an array of statuses are returned. In the meantime, I chose to load the table as soon as absences were fetched and I used loading spinners in the conflicts column as each absence row fetched their conflicts status.

I would also introduce pagination for larger data-sets.

## Why use Shadcn UI?

I used Shadcn UI to imitate how we use BUI. Consistent styles and branding across the project. In the future, if we wanted to change how a component looked (like a button), we can change it in one central location, as opposed to finding every use of that component and editing the styles. The components are copied into the codebase rather than installed as a dependency, giving full control over customization without fighting library constraints.
