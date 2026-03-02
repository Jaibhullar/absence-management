pagination, 2 pages, 10 items each

reset sorting

converting sorting to util(s)

Why feature slice arch waa chosen and compare to DDD or flat structure - readme

justify why named folder ui,  and not atoms or moving components to flat level.
Reasoning:

/////////

ui/ is a common convention — especially with shadcn/ui (which it looks like you're using based on components.json). Developers expect it.

atoms/ implies Atomic Design commitment — If you rename to atoms/, the question becomes "where are molecules and organisms?" You'd need to restructure everything to fit that mental model.

Flattening would cause confusion — Your ui/ components are generic primitives (button, badge). Mixing them with AbsencesTable/ (a feature component) makes it harder to understand what's reusable vs feature-specific.


////////

Remove shadn ui - not appropriate for size of the application

remove section container

one header

back button for banner - close buttons more suitable for modals

refactor table to make it scalable and not be tied to absence logic - usable elsewhere without lots of modifications

Declerative mappiong function for sort func

solid primnc - single responsilbity for func
open close princ - 

Letter	Principle	One-liner
S	Single Responsibility	A class/function should do one thing only
O	Open/Closed	Open for extension, closed for modification
L	Liskov Substitution	Subtypes must be substitutable for their base types
I	Interface Segregation	Don't force clients to depend on methods they don't use
D	Dependency Inversion	Depend on abstractions, not concrete implementations