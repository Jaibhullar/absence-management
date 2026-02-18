Why Vite + React instead of Next.js? 

There are no SEO requirements. This is a client-side dashboard. Next.js would be better for complex routing.

Why not use React Query? 

Since there is only one fetch on page load, and there are no other pages to navigate into and back, and there is no pagination, there is no need to cache responses. But if this was a multi-page project where the user leaves and returns the absence management table, or if there was pagination, then I would have used React Query. 

Why custom hooks and prop-drilling insteadof statemanagment libraries (e.g. Zustand, React Context)?

For the small scope of thi feature, built-in state and custom hooks are sufficient. The cost of the extra enginering of introducing state managament would be more apprioriate for a larger project where cross-component state sharing becomes un-sustainable. 

How could performance be improved?

Whether an absence has a conflict should ideally be included as a boolean on the fetch absences, rather than being a seperate endpoint we have to call again for each absence. In the meantime, I used lazy loading to get the table rendered as soon as possible, and loading spinners whilst the conflit checks are being fetched. 

