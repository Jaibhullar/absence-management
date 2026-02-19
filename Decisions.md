## Why Vite + React instead of Next.js?

There are no SEO requirements and there is no complex routing. This is a client-side dashboard with only a single page scope.

No SEO requirements:

As this is a client-side dashboard app, there is no need for SEO. Server-side rendering with Next.js would mean that the user visits the page, server runs the codes and builds the HTML with the data already inside it, then returns it to the user as a complete page. Client-side rendering with Vite + React means that the user visits the page, is met with an empty HTML file and javascript files. Javascript runs in the user's browser and fetches data from the API and builds the page. Next.js would be better for web crawlers as React requires the crawlers to wait for the javascript to run and populate the HTML, however as this is Absence Management feature would be part of a authentication protectd dashboard, there is no need for the SEO benefit Next.js brings.

No complex routing:

This is a single page applicaiton, which is perfectly sufficient for Vite + React. Even if there was multiple routes, React Router would be the first preference - as opposed to jumping straight to Next.js. Next.js is great for dealing with 50+ routes that require handling of parallel (e.g. a dashboard showing multiple pages/sections within view, each with their own navigation) and intercepting routes (staying on the current page with new content appearing on top as a modal).

Next.js adds additional unneccessary complexity:

With Next.js, you are consistently having to decide whether a component is rendered on the server or the browser. In order to use react hooks, you must add "use client" at the top of the document. With Next.js, you also have to deal with hydration warnings - where the server HTML doesn't match the HTML rendered with React on the client (common causes being Date.now(), Math.random()) However, with Vite + React, everything runs on the browser so everything is simplified. Everything is "use client" by default and everything is rendered on the browser - so no hydration errors.

Vite + React is also more simple to deploy - it deals with static files, so can be uploaded anywhere (e.g. Github Pages, Netlify). Next.js deals with a Node.js application that needs a server to run - so can only be deployed to Vercel, your own Node server or docker.

Vite + React offers faster development

Next.js is also slower to develop on. Vite starts in ~300ms and has instant hot reload. Next.js starts in 2-5 seconds and has a slower hot reload. This is because with Vite, you save a file, Vite sends only that saved file to the browser and the browser updates indstantly (~50ms). But with Next.js, you save a file. Next.js reads it, checks if the file is used on the server - if so, it recompiles (transforms/converts JSX and typescript to javascript) the server bundle (javascript files squashed into one or a few files) and sends it to the browser. Then it checks if the file is used on the client, and goes through the same process. With Vite, there is no bundling and no recompiling. If this was a resturant and you asked the Chef to change an ingredient, with Vite + React, the chef would swap out just that ingredient, but with Next.js, the chef would remake the entire meal.

## Why not use React Query?

Since there is only one fetch on page load, and there are no other pages to navigate into and back, and there is no pagination, there is no need to cache responses. But if this was a multi-page project where the user leaves and returns the absence management table, or if there was pagination, then I would have used React Query.

## Why custom hooks and prop-drilling instead of statemanagment libraries (e.g. Zustand, React Context)?

For the small scope of thi feature, built-in state and custom hooks are sufficient. The cost of the extra enginering of introducing state managament would be more apprioriate for a larger project where cross-component state sharing becomes un-sustainable.

## How could performance be improved?

Whether an absence has a conflict should ideally be included as a boolean on the fetch absences, rather than being a seperate endpoint we have to call again for each absence. In the meantime, I used lazy loading to get the table rendered as soon as possible, and loading spinners whilst the conflit checks are being fetched.
I would also introduce pagination for larger data-sets.

## Why use Shadcn UI

I used shadcn UI to immitate how we use BUI. Consistent styles and branding across the project.
