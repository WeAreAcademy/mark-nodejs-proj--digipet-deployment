import supertest from "supertest";
import { Digipet, setDigipet } from "../digipet/model";
import app from "../server";

/**
 * This file has integration tests for training a digipet.
 *
 * It is intended to test two behaviours:
 *  1. training a digipet leads to increasing discipline
 *  2. training a digipet leads to decreasing happiness
 */

describe.skip("When a user trains a digipet repeatedly, its discipline increases by 10 each time until it eventually maxes out at 100", () => {
  beforeAll(() => {
    // setup: give an initial digipet
    const startingDigipet: Digipet = {
      happiness: 60,
      nutrition: 80,
      discipline: 75,
    };
    setDigipet(startingDigipet);
  });

  test("GET /digipet informs them that they have a digipet with expected stats", async () => {
    const response = await supertest(app).get("/digipet");
    expect(response.body.message).toMatch(/your digipet/i);
    expect(response.body.digipet).toHaveProperty("discipline", 75);
  });

  test("1st GET /digipet/train informs them about the train and shows increase discipline for digipet", async () => {
    const response = await supertest(app).get("/digipet/train");
    expect(response.body.digipet).toHaveProperty("discipline", 85);
  });

  test("2nd GET /digipet/train shows continued stats change", async () => {
    const response = await supertest(app).get("/digipet/train");
    expect(response.body.digipet).toHaveProperty("discipline", 95);
  });

  test("3rd GET /digipet/train shows discipline hitting a ceiling of 100", async () => {
    const response = await supertest(app).get("/digipet/train");
    expect(response.body.digipet).toHaveProperty("discipline", 100);
  });

  test("4th GET /digipet/train shows no further increase in discipline", async () => {
    const response = await supertest(app).get("/digipet/train");
    expect(response.body.digipet).toHaveProperty("discipline", 100);
  });
});

describe.skip("When a user trains a digipet repeatedly, its happiness decreases by 5 each time until it eventually floors out at 0", () => {
  beforeAll(() => {
    // setup: give an initial digipet
    const startingDigipet: Digipet = {
      happiness: 11,
      nutrition: 50,
      discipline: 50,
    };
    setDigipet(startingDigipet);
  });

  test("GET /digipet informs them that they have a digipet with expected stats", async () => {
    const response = await supertest(app).get("/digipet");
    expect(response.body.message).toMatch(/your digipet/i);
    expect(response.body.digipet).toHaveProperty("happiness", 11);
  });

  test("1st GET /digipet/train informs them about the train and shows decreased happiness for digipet", async () => {
    const response = await supertest(app).get("/digipet/train");
    expect(response.body.digipet).toHaveProperty("happiness", 6);
  });

  test("2nd GET /digipet/train shows continued stats change", async () => {
    const response = await supertest(app).get("/digipet/train");
    expect(response.body.digipet).toHaveProperty("happiness", 1);
  });

  test("3rd GET /digipet/train shows happiness hitting a floor of 0", async () => {
    const response = await supertest(app).get("/digipet/train");
    expect(response.body.digipet).toHaveProperty("happiness", 0);
  });

  test("4th GET /digipet/train shows no further decrease in happiness", async () => {
    const response = await supertest(app).get("/digipet/train");
    expect(response.body.digipet).toHaveProperty("happiness", 0);
  });
});

describe.skip("When a digipet is maxed out on discipline, it is still possible to train it and decrease its happiness", () => {
  beforeAll(() => {
    // setup: give an initial digipet
    const startingDigipet: Digipet = {
      happiness: 50,
      nutrition: 50,
      discipline: 100,
    };
    setDigipet(startingDigipet);
  });

  test("GET /digipet informs them that they have a digipet with expected stats", async () => {
    const response = await supertest(app).get("/digipet");
    expect(response.body.message).toMatch(/your digipet/i);
    expect(response.body.digipet).toHaveProperty("discipline", 100);
    expect(response.body.digipet).toHaveProperty("happiness", 50);
  });

  test("GET /digipet/train shows that discipline remains at 100 but happiness has decreased", async () => {
    const response = await supertest(app).get("/digipet/train");
    expect(response.body.digipet).toHaveProperty("discipline", 100);
    expect(response.body.digipet).toHaveProperty("happiness", 45);
  });
});
