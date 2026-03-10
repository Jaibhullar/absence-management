_Some notes on why I built things the way I did._

---

## Folder structure

I went with feature slice - grouping code by feature instead of by type. So `Table/` has its own hooks, utils, sub-components all in one place.

I considered a flat structure (all components in one folder, all hooks in another) but that gets messy fast. You end up jumping between 5 different folders just to work on one feature.

DDD was overkill here. It's great when you have multiple teams working on different domains, but for a single-page app it's just extra boilerplate.

## Why Vite + React instead of Next.js?

Honestly, Next.js would've been overkill. This is a dashboard behind auth - no one's crawling it for SEO. And it's a single page, so no complex routing needed.

Next.js also adds complexity I didn't want to deal with. You're constantly thinking "is this server or client?", adding "use client" everywhere, debugging hydration mismatches. With Vite, everything just runs in the browser. Simple.

Plus Vite is way faster to develop with. Hot reload is basically instant (~50ms) compared to Next.js which has to recompile bundles. If this was a restaurant and you asked the Chef to change an ingredient, with Vite the chef swaps out just that ingredient. With Next.js, the chef remakes the entire meal.

Deployment is simpler too - just static files that can go anywhere (Github Pages, Netlify, whatever). Next.js needs an actual server.

## React Query

I actually started without React Query - felt like overkill for a one-page app with no pagination. But I kept writing the same loading/error state boilerplate and eventually gave in.

It's made things cleaner. No more manually managing isLoading/isError states. And if we ever add more pages or backend pagination, the caching is already there.

## Props vs state management libraries

Props are drilled max 3 levels deep which is fine to trace. I didn't want to reach for Zustand or Context when I didn't need to.

It's tempting to add a state library "just in case" but I've seen what happens when packages get deprecated - e.g. at BrightHR we're still dealing with Lodash everywhere, and Formik is next. React's built-in tools are enough here.

If this grew bigger, I'd look at colocating state first, then maybe Context if components needed to be reusable across different parts of the app.

## Reusable Table component

I considered two approaches here:

**Option A: "Dumb" table** - Table just renders rows, parent components handle sorting/filtering/pagination. Simpler component, but logic gets scattered across consumers.

**Option B: "Smart" table** - Table owns its own sorting/filtering/pagination logic. More complex internally, but drop-in reusable.

I went with Option B because:
1. The brief mentioned "consideration for future requirements" - an employees table, reports table, etc. would all need the same features
2. Logic stays colocated - `useTableLogic` handles state, utils handle transformations, all in one place
3. The API is still flexible - you can pass `onSort` for backend sorting, or let it sort client-side

That said, if this was a design system used by multiple teams, I'd probably go with Option A (headless components like Tanstack Table) so each team controls their own UX. For a single app with one developer, Option B keeps things simpler to maintain.

The pagination config API is admittedly complex (discriminated unions for each format). In hindsight, I could've simplified to just `paginationFormat` and `recordsPerPage` props since I only ended up using frontend pagination.

## Client-side sorting/filtering

The API doesn't support pagination params so everything's done client-side. Not ideal for huge datasets but fine for this use case. If the backend added `page`, `limit`, `sortBy` params I'd move the logic there.

## API gripes

Bit annoying that conflict status is a separate endpoint per absence. Would be nicer as a boolean on the main response, or at least a batch endpoint. For now I just show spinners in the conflict column while each row fetches its status.

## Testing

Tests are colocated with source files (`Component/test.tsx`). Easier to find and reminds me to actually write them. Unit tests focus on utility functions and hooks where bugs are most likely. I'm not testing implementation details - just user-facing behaviour.

Skipped E2E tests since that would need Playwright and is out of scope.

## Other notes

**Accessibility:** Using semantic HTML (`<table>`, `<th scope="col">`) and ARIA attributes. Keyboard nav works. Not retrofitted, just built in from the start.

**Type safety:** Used discriminated unions for pagination config so TypeScript knows which props are available based on the format. Catches bugs at compile time instead of runtime.

**Error handling:** React Query handles it. If fetching absences fails, you see an error. If one conflict check fails, just that row shows an error - doesn't break the whole table.
