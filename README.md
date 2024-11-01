# DFDS Code Challenge

### How to Start the Project
* Clone this repo to get started
* Copy `.env.example` to `.env`
* Run `pnpm install`
* Run `pnpm db:reset`
* Start the project with `pnpm dev`

The Swagger documentation for the Mock API is available at:
[http://localhost:3000/api-doc](http://localhost:3000/api-doc)

### Assumptions made during voyage creation
- No past dates, all dates must be in the future.
- A voyage/journey can only be scheduled 24 hours from the time of booking. This could be due to:
    -  different departments it may need to go through for review, verification and approval.
    -  availability of the vessel for the departure/arrival
    -  necessary payments that are pending
    -  servicing/maintenance of the vessel
    -  maximum capacity of the vessel may not be reached
    
- A voyage/journey between port of loading and port of discharge is at least 2 hours for all journeys. This could be due to:
    -  distance between the two ports
    -  vessel weight
    -  vessel speed
    -  weather conditions based on predictions for the department/arrival times

### Tools/Libraries used
- NextJS
- TypeScript
- Prisma
- React Query
- Tailwind
- Zod
- ShadCN

### Possible Improvements
- Add testing
- Add mobile responsiveness
- Add pagination

