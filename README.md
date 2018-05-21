# CSE154 JSLint

Powered by [ESLint](https://eslint.org/), this is the web version of the popular JavaScript Linter for CSE 154.
The idea behind the switch from Marty Stepp/Douglas Crawford's JSLint is due to it's
lack of extensibility and it was built to lint code of a different time. ESLint has many
built in [predefined rules](https://eslint.org/docs/rules/) to quickly get off the ground.
If that is not enough, [creating new rules](https://eslint.org/docs/developer-guide/working-with-rules)
shouldn't be too hard. ESLint mainly requires Node.js to work. However, with Browserify,
one is able to build and encapsulate ESLint into a JavaScript source that then could work on a modern
browser with the help of require.js lib.

## Obtaining ESLint
You need to install eslint from npm for it to work on the command line. https://eslint.org/docs/user-guide/getting-started

## Updating and using the web ESLint
From time to time, ESLint may update to include new exciting features and rules.
One would need to rebuild it so that the newer version of ESLint may work on the browser.
To do so, obtain the most [recent source](https://eslint.org/docs/developer-guide/source-code) of ESLint.
Then run `npm install` to download the dependancies and `npm run browserify` to build `eslint.js`.
Navigate to the `build/` folder and replace the `eslint.js` in this repo with the newer version that you just
built. The `eslint.js` exposes the [Linter object](https://eslint.org/docs/developer-guide/nodejs-api#linter)
that is used for validation on the client side.

## Updating CSE 154 JSLint rules
All the rules are defined in the `eslint-config.json` file. Edit that file to add/remove/change rules.
