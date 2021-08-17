# D3Akita AKA

This is a sample of how [Akita]('https://datorama.github.io/akita/') and [D3.js](https://d3js.org/) can be used together.

I was tasked to incorporate NgRx, though I wanted to explore other solutions (Less boiler platey solutions). This is where I found Akita. With the help of the schematics to generate stores, I was able to utilize the stores with ease.

The app has a brand and that brand is **Fwends**.
To login just use any username or password (Login page was created to see the auth store update primarily)

## Things to TODO

- Add Real authentication (Single sign on with firebase would be cool)
- Add more unit tests
- D3.js types were difficult to maneuver, so there are places we used type of any
- Add backend server (node.js express?) for the api calls instead of mocks

## Things Learned

 - Akita was a welcoming alternative to NgRx and was fun to learn and utilize.
 - You can use Redux Devtools with Akita—neat.
 - D3.js had a huge learning curve—bigly. 
 - BUT you can do some awesome shtuff with D3.js—like really cool.
 - Utilize more Angular Material components

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
