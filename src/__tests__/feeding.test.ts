import supertest from "supertest";
import { Digipet, setDigipet } from "../digipet/model";
import app from "../server";

/**
 * This file has integration tests for feeding a digipet.
 *
 * It is intended to test two behaviours:
 *  1. feeding a digipet leads to increasing nutrition
 *  2. feeding a digipet leads to decreasing discipline
 */

describe.skip("When a user feeds a digipet repeatedly, its nutrition increases by 10 each time until it eventually maxes out at 100", () => {
  beforeAll(() => {
    // setup: give an initial digipet
    const startingDigipet: Digipet = {
      happiness: 60,
      nutrition: 75,
      discipline: 60,
    };
    setDigipet(startingDigipet);
  });

  test("GET /digipet informs them that they have a digipet with expected stats", async () => {
    const response = await supertest(app).get("/digipet");
    expect(response.body.message).toMatch(/your digipet/i);
    expect(response.body.digipet).toHaveProperty("nutrition", 75);
  });

  test("1st GET /digipet/feed informs them about the feed and shows increased nutrition for digipet", async () => {
    const response = await supertest(app).get("/digipet/feed");
    expect(response.body.digipet).toHaveProperty("nutrition", 85);
  });

  test("2nd GET /digipet/feed shows continued stats change", async () => {
    const response = await supertest(app).get("/digipet/feed");
    expect(response.body.digipet).toHaveProperty("nutrition", 95);
  });

  test("3rd GET /digipet/feed shows nutrition hitting a ceiling of 100", async () => {
    const response = await supertest(app).get("/digipet/feed");
    expect(response.body.digipet).toHaveProperty("nutrition", 100);
  });

  test("4th GET /digipet/feed shows no further increase in nutrition", async () => {
    const response = await supertest(app).get("/digipet/feed");
    expect(response.body.digipet).toHaveProperty("nutrition", 100);
  });
});

describe.skip("When a user feeds a digipet repeatedly, its discipline decreases by 5 each time until it eventually floors out at 0", () => {
  beforeAll(() => {
    // setup: give an initial digipet
    const startingDigipet: Digipet = {
      happiness: 50,
      nutrition: 50,
      discipline: 11,
    };
    setDigipet(startingDigipet);
  });

  test("GET /digipet informs them that they have a digipet with expected stats", async () => {
    const response = await supertest(app).get("/digipet");
    expect(response.body.message).toMatch(/your digipet/i);
    expect(response.body.digipet).toHaveProperty("discipline", 11);
  });

  test("1st GET /digipet/feed informs them about the feed and shows decreased discipline for digipet", async () => {
    const response = await supertest(app).get("/digipet/feed");
    expect(response.body.digipet).toHaveProperty("discipline", 6);
  });

  test("2nd GET /digipet/feed shows continued stats change", async () => {
    const response = await supertest(app).get("/digipet/feed");
    expect(response.body.digipet).toHaveProperty("discipline", 1);
  });

  test("3rd GET /digipet/feed shows discipline hitting a floor of 0", async () => {
    const response = await supertest(app).get("/digipet/feed");
    expect(response.body.digipet).toHaveProperty("discipline", 0);
  });

  test("4th GET /digipet/feed shows no further decrease in discipline", async () => {
    const response = await supertest(app).get("/digipet/feed");
    expect(response.body.digipet).toHaveProperty("discipline", 0);
  });
});

describe.skip("When a digipet is maxed out on nutrition, it is still possible to feed it and decrease its discipline", () => {
  beforeAll(() => {
    // setup: give an initial digipet
    const startingDigipet: Digipet = {
      happiness: 50,
      nutrition: 100,
      discipline: 50,
    };
    setDigipet(startingDigipet);
  });

  test("GET /digipet informs them that they have a digipet with expected stats", async () => {
    const response = await supertest(app).get("/digipet");
    expect(response.body.message).toMatch(/your digipet/i);
    expect(response.body.digipet).toHaveProperty("nutrition", 100);
    expect(response.body.digipet).toHaveProperty("discipline", 50);
  });

  test("GET /digipet/feed shows that nutrition remains at 100 but discipline has decreased", async () => {
    const response = await supertest(app).get("/digipet/feed");
    expect(response.body.digipet).toHaveProperty("nutrition", 100);
    expect(response.body.digipet).toHaveProperty("discipline", 45);
  });
});
