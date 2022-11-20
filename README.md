# Digipet - Deployment

<a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" /></a>

> This is part of Academy's [technical curriculum for **The Mark**](https://github.com/WeAreAcademy/curriculum-mark). All parts of that curriculum, including this project, are licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License</a>.

Now we'll deploy your Digipet (both frontend and backend), so that others can interact with your digipet over the web without you having to run anything locally.

## Learning Outcomes

- Deploy a Node.js server to render.com

## Pre-reqs:

* you have completed a previous exercise to deploy a guestbook app to render.com and have an account there.
* your digipet backend repo is ready on github


## Exercise 0: Running your compiled JavaScript server

> 🎯 **Success criterion:** you can run your compiled _JavaScript_ digipet server locally

In a previous project, we wrote our digipet server in TypeScript and we've been running it locally using `ts-node` - which effectively compiles our TypeScript into JavaScript for us.

This is fine for development, but in deployment we would typically separate out this 'build' and 'start' process.

We'll do this locally by:

1. Adding a `build` script to compile our TypeScript to JavaScript
2. Changing our `start` script to use `node` to run our compiled JavaScript

`tsc` is used to compile TypeScript to JavaScript.

The `tsconfig.json` provided in your digipet backend starter has `dist` set as the target compilation directory (`outDir`) for the resultant JavaScript, which means we should add the following scripts:

```diff
"scripts": {
-  "start": "ts-node src",
+  "start": "node dist",
   "start:dev": "ts-node-dev src",
+  "build": "tsc",
   "test": "jest",
   "test:watch": "jest --watch"
},
```

Now, test that you can run your compiled JavaScript locally:

1. `yarn build` to compile to JavaScript
2. `yarn start` to run the compiled JavaScript


## Exercise 1: Deploying backend to render.com

> 🎯 **Success criterion:** you have a deployed backend to render.com (and can make requests to it via Postman and your browser)


Follow the deployment stage of the guestbook exercise, but this time for your digipet back-end repo.

Once successful you should have a URL with this sort of format:

```
https://some-slug-12345.onrender.com/
```

and you should be able to then hit all the associated endpoints from that deployed server url, e.g.:

- `https://some-slug-12345.onrender.com/instructions`
- `https://some-slug-12345.onrender.com/digipet`
- `https://some-slug-12345.onrender.com/digipet/hatch`

from any client of your choice: Postman, your browser, or your frontend app running on `localhost:3000` (pointing it to this new URL instead of `localhost:4000`).

## Exercise 3: Deploying frontend, pointing to deployed backend

> 🎯 **Success criterion:** you have a deployed frontend which connects to your deployed backend - so anybody can interact with your deployed digipet game

You should be able to point your React frontend to your deployed digipet backend, instead of `localhost:4000`.

After you've done this, you can deploy your React frontend to a service of your choice (e.g. Netlify).

(One tidy way to have this automatically appropriately switch from, say, localhost:4000 to your deployed back-end is described in the material: fullstack-todo-app.)

Now you've got a full-stack deployed Digipet game! 🐱
