# Digipet - Deployment

<a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" /></a>

> This is part of Academy's [technical curriculum for **The Mark**](https://github.com/WeAreAcademy/curriculum-mark). All parts of that curriculum, including this project, are licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License</a>.

Now we'll deploy your Digipet (both frontend and backend), so that others can interact with your digipet over the web without you having to run anything locally.

## Learning Outcomes

- Deploy a Node.js server to Heroku

## Exercise 0: Running your compiled JavaScript server

> 🎯 **Success criterion:** you can run your compiled _JavaScript_ digipet server locally

We've written our server in TypeScript and we've been running it locally using `ts-node` - which effectively compiles our TypeScript into JavaScript for us.

This is fine for development, but in deployment we would typically separate out this 'build' and 'start' process.

We'll do this locally by:

1. Adding a `build` script to compile our TypeScript to JavaScript
2. Changing our `start` script to use `node` to run our compiled JavaScript

3. Clone/fork the repo
4. Take some time to read and digest the code
5. Explore and run the tests
6. Play around with it via Postman
7. Google things that you don't understand
8. Experiment with changing things
9. Produce a narrative document

## Exercise 1b: Making sense of the system and its units

(can be completed alongside 1a, or before/after)

> 🎯 **Success criterion:** you can demonstrate the independence of different units within the system of walking your digipet by (deliberately) breaking one set of unit tests without breaking other sets of unit tests

### `/digipet` vs `server.ts`

The `/digipet` folder is for all functions that read or update digipet data.

The job of `server.ts` is to set up our server endpoints and dictate server responses (and sometimes calling a function from `/digipet` to make side-effects happen).

### Model vs Controller

Some software architectural patterns distinguish between 'Model' and 'Controller' (a famous pattern is MVC: Model-View-Controller).

We're not formally using MVC (e.g. it's traditionally object-oriented, which this example is not). However, we're repurposing its vocabulary to make an approximate distinction between things in our digipet code:

- _Model_: the code that creates the _levers_ which can be pulled to read/update digipet data (the puppet with strings)
- _Controller_: the functions that pull the digipet model's levers in order to effect changes (the puppeteer pulling strings)

For example: `walkDigipet` is a descriptive controller function which calls the `updateDigipetBounded` model function.

## Making sense of the tests

There are [lots of different types of testing](https://www.atlassian.com/continuous-delivery/software-testing/types-of-software-testing).

In this exercise, we're focusing on two types:

1. Unit tests
2. Non-unit tests
   1. Integration tests
   2. End-to-end (E2E) tests

Whilst there is a distinction between integration and E2E tests, for now, we'll lump them together under 'non-unit tests', and focus on distinguishing between unit and non-unit tests.

Start by reading [this Google blog on unit vs E2E tests](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html).

Once you have read that, we'll consider how types of test manifest in the codebase.

### Testing walking a digipet

Let's look at how we're testing "walking a digipet".

Before you attempt this section, you should experiment with walking your digipet through Postman and the `/digipet/walk` endpoint.

The desired behaviour of walking a digipet (which you should be able to observe) is:

1. If we have a digipet, we should be able to walk our digipet through the `/digipet/walk` endpoint
   1. _Data change_: Walking a digipet should increase its happiness by `10` and decrease its nutrition by `5` (to model needing to replenish energy)
      1. Happiness can increase only as far as to `100`
      2. Nutrition can decrease only as far as to `0`
   2. _Server response_: The endpoint should respond with a message indicating that the digipet has been taken for a walk
2. If we don't have a digipet, the `/digipet/walk` endpoint doesn't walk any digipet
   1. _Server response_: The endpoint should respond with a message indicating that it isn't possible to walk a non-existent digipet

Server response and data change are two different jobs, so it is helpful to reason about them and write them as separate bits of functionality.

It also makes sense to therefore test them separately. If the overall 'walking a digipet' behaviour is not working as expected, it's helpful to have focused tests which tell us more precisely which part of it is not working as expected.

We might divide up the tests as follows:

**1. _Data change:_ Does the `walkDigipet` controller function change Digipet stats as expected?**

We could test a `walkDigipet` function that should:

1. Increases the digipet's happiness by `10`, up to ceiling of `100`
2. Decreases the digipet's nutrition by `5`, down to a floor of `0`

This is tested as isolated behaviour in `src/digipet/controller.test.ts`.

> 🧠 Make sure that you can find the relevant test.

This is _unit testing_: tightly focused to a single function behaviour, and not dependent on the behaviour of other functions.

**2. _Server response:_ Does the server's `/digipet/walk` endpoint give back a sensible response?**

We could test a `/digipet/walk` endpoint that should:

1. Sends back an acknowledgement message about walking the digipet when we have one
2. Sends back a helpful message explaining that we can't walk a digipet when we don't have one
3. Delegates actual data change to the `walkDigipet` function

This is tested as isolated behaviour in `src/server.test.ts`.

> 🧠 Make sure that you can find the relevant test.

This is, again, _unit testing_: tightly focused to a single endpoint, and not dependent on the behaviour of other endpoints or functions.

(Importantly: this unit test _does not care at all_ about the implementation or behaviour of `walkDigipet`. It tests that `walkDigipet` gets _called_, but it would be possible for us to entirely change the behaviour of `walkDigipet` and our endpoint unit test would not break.)

**3. Does this come together as expected?**

Unit tests check small individual parts of a system - the 'non-unit' tests then check the wider system:

- _integration tests_ check a small number of parts of the system work together
- _end-to-end (E2E) tests_ check the system as a whole against user journeys, from start to finish

We could test that, when we hit the `/digipet/walk` endpoint repeatedly over time, the server response and data change happen in tandem as we expect - the server response demonstrates the increase and decrease in happiness and nutrition respectively, up to the ceiling of `100` and floor of `0`.

Because we have a very small system (which doesn't have many parts), the distinction between 'integration tests' and 'E2E tests' is a little more grey, so this isn't the critical distinction to focus on right now - what's most important to note is that the tests in `/__tests__/walking.test.ts` are _non-unit_ tests.

### Breaking independent unit tests

Well-designed unit tests, which test separate units of the system, should be independent as much as possible.

Specifically, in this example: it should be possible for our `walkDigipet` unit tests to fail without the `/digipet/walk` unit tests failing, and vice-versa.

The unit tests have been written in such a way to make this work.

So, _without changing the test code_:

1. Make the `walkDigipet` unit tests fail without making the `/digipet/walk` unit tests fail
2. Make the `/digipet/walk` unit tests fail without making the `walkDigipet` unit tests fail

(These are temporary things to do - you should revert the code back to a non-breaking state after each task.)

Does the non-unit test break when one of its unit components break?

## Exercise 2: TDD (existing tests) - training and feeding

> 🎯 **Success criterion:** the tests (both unit and integration) for training and feeding the digipet all pass

There are unit and integration tests already written for training and feeding digipets. It's your task to make them pass.

They have a very similar structure to the tests for walking a digipet: a set of integration tests, and two sets of unit tests.

A sensible approach is to build up from the unit tests to the integration tests (and it may be sufficient to get the unit tests to pass for the integration tests to pass).

Try the following two approaches:

1. For training the digipet, start with making the `trainDigipet` unit tests pass and then move onto the `/digipet/train` unit tests
2. For feeding the digipet, start with making the `/digipet/feed` unit tests pass and then move onto the `/digipet/feed` unit tests

## Exercise 2: TDD (specification provided) - ignoring

> 🎯 **Success criterion:** you have added passing tests for ignoring the digipet following the below criteria

Now, we've added to walking, training and feeding the digipet to our game - we'll now add ignoring the digipet (which leads to its sad deterioration).

The desired behaviour is as follows:

1. GIVEN that the user does not have a digipet, WHEN they send a `GET` request to the `/digipet/ignore` endpoint, THEN the server responds with a message informing them that they don't have a digipet and suggesting that they try hatching one
2. GIVEN that the user has a digipet with all stats above `10`, WHEN they send a `GET` request to the `/digipet/ignore` endpoint, THEN the server responds with a message confirming that they have ignored their digipet and includes digipet stats that show a decrease in all stats by `10`
3. GIVEN that the user has a digipet with some stats below `10`, WHEN they send a `GET` request to the `/digipet/ignore` endpoint, THEN the server responds with a message confirming that they have ignored their digipet and includes digipet stats that have decreased by `10` down to a possible floor of `0`

Write some unit tests and integration tests for this, then write the code to make it pass.

## Exercise 3: TDD (no specification) - rehoming

> 🎯 **Success criterion:** you have a specification, tests and passing code for rehoming a digipet

Add a rehoming feature to our digipet endpoint game - where the user is able to rehome their digipet, freeing up space for them to hatch a new one if desired.

Unlike above, we're not giving you the prescriptive behaviour - it's up to you to:

1. Create a specification for the desired behaviour
2. Write tests for this behaviour (unit tests and integration tests)
3. Write the code to pass your tests

## Exercise 4: Commentary and reflection

> 🎯 **Success criterion:** documented reflections.
