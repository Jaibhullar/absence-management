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

## Why use React Query?

At first, I chose not to use React Query as I did not feel it was necessary for a one page application with no where else to navigate to and no pagination - the only API calls are made on first page render. However, I chose to implement React Query in the end to simplify loading and error states and remove the need to store and set them manually in React useStates. Using React Query also allows me to add a retry button in the event that fetching absences fail with the use of React Query's refetch function - if that was a feature that users would want. Using React Query also making this project scalable. If pagination/page-number was introduced in the future as a backend payload option, then the page number could easily be passed as a queryKey - allowing the user to cache previous pages of absences and return to them without waiting for repeated API calls. If other pages was introduced to the project, then caching would allow them to navigate to other routes and return to Absences Management page without a fresh API call.

## Why custom hooks and prop-drilling instead of statemanagment libraries (e.g. Zustand, React Context)?

For the small scope of this feature, built-in state and custom hooks are sufficient. The cost of the extra enginering of introducing state managament would be more apprioriate for a larger project where cross-component state sharing becomes un-sustainable.

I chose to use prop drilling as opposed to other methods of state management. This is because Props are only being drilled 3 levels max which is still easy to trace and does not require significant changes if prop names change etc. It also prevents the need for an additional external package - where changes to the package could effect my project without my knowledge or control, a risk when taking on external packages. However, if the scrope of the project was larger and prop drilling became un-sustainable and difficult to trace, then I would prefer to use zustand. This is because it has very litle boilerplate code, and it also is superior to React Context at it prevents unnessessary re-renders. With React Context, if any of the values within the context changes, any component using the context re-renders - even if the component is not using the specific changed value. On the other hand, with Zustand, each component subscribes only to the specific slice of state it needs - so unrelated state changes don't cause re-renders.

However, it is possible both React Context and Zustand could be used if the scrope of the project expanded. React Context could store values that rarely change, such as user profile, preferred theme of the app and their location if there are UI specific to location (e.g. annual leave vs vacation).

## How could performance be improved?

Whether an absence has a conflict should ideally be included as a boolean on the fetch absences, rather than being a seperate endpoint we have to call again for each absence. Or there could be a batch endpoint where an array of absence-ids can be passed and an array of status's are returned. In the meantime, I chose to load the table as soon as absences were fetched and I used loading spinners in the conflicts column as each absence row fetched their conflicts status.
I would also introduce pagination for larger data-sets.

## Why use Shadcn UI

I used shadcn UI to immitate how we use BUI. Consistent styles and branding across the project. In the future, if we wanted to change how a component looked (like a button), we can change it in one central location, as opposed to finding every use of that component and editing the styles. The components are copied into the codebase rather than installed as a dependency, giving full control over customization without fighting library constraints.
