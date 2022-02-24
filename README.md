# GasFast: Ethereum Gas Tracker

## The Problem

Interactions with the Ethereum chain happen constantly throughout the day. The cost of these interactions are calculated based on "Gas used by that transaction \* Gas price". Because of this it is crucial to ensure that we utilize the chain in an cost-effective manner to reduce operational costs.

## The Solution

Introducing GasFast, a utility tool for tracking Gas Prices. GasFast has 2 main features. The first feature is the ability to view the current Gas price of the 3 tiers(fast, average, and low) at the moment of the request. The second feature is to view historic average Gas prices. An example would be if I wanted to know what the average price of Gas was from last Saturday to Sunday. A simple request can be made using the unix times for last Saturday and Sunday and the response will contain the average gas price for the 3 tiers(fast, average, and low).

## Document Tradeoffs

For this backend API, I decided to use JavaScript, Node.js, Express, and MongoDB. The main reason for these choices were that I was time limited on this challenge and these were the most recent technologies that I had been using, so I could quickly get started. If I had more time to work on this project, what I would have changed were **language choices, structure, and the addition of tests**.

- For languages, I would have used TypeScript instead as that is the current tech stack at AlphaPoint and the reason I didn't use it for this project was that I didn't know the syntax of TypeScript, though it is extremely similar to JavaScript, and felt that adding an additional unknown factor could cause future errors.
- For the structure of the project, what I would change would be the how routes are handled within the application. Instead of having the two routes inside of the app.js, I would split each into its own file inside a controller directory. This would also allow for the easy addition of future currencies outside of Gas.
- Lastly, for the addition of tests I would use a library like Jest for writing unit tests. This would range from checking the initial state of the MongoDB database as well as testing to make sure all error cases are covered in each of the API routes.

## Getting Started with the Application

For running this application, you will need Docker as well as Docker-compose.

- Docker can be downloaded from here: https://docs.docker.com/get-docker/
- Docker-compose can be downloaded from here: https://docs.docker.com/compose/install/

Steps to run the application:

1. Clone this repository
2. Open the project in any ide or text editor
3. Open the docker-compose.yml file and navigate to line 21 which contains "ETHGASSTATION_API_KEY"
4. Replace "#API-KEY-HERE" with your ethgasstation api key
   i. ethgasstation api key can be obtained from https://data.defipulse.com/
   ii. After registering and logging in, go to the dashboard(https://data.defipulse.com/dashboard/egs) and you should find a section containing the api key
5. Open a terminal and navigate to the project directory
6. Run docker-compose up
7. Project should now be up and running, send requests to localhost/3002
