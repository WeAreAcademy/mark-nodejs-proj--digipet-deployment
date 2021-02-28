import { Digipet, getDigipet, updateDigipetBounded, setDigipet } from "./model";

describe("getDigipet", () => {
  it("gets the stats for the user digipet (but not the underlying object)", () => {
    const digipetTest: Digipet = {
      happiness: 60,
      nutrition: 60,
      discipline: 60,
    };
    setDigipet(digipetTest);
    expect(getDigipet()).toStrictEqual(digipetTest);
    expect(getDigipet()).not.toBe(digipetTest);
  });

  it("returns null if there is no digipet", () => {
    setDigipet(undefined);
    expect(getDigipet()).toBeNull();
  });

  it("resists accidental mutation", () => {
    const digipetTest: Digipet = {
      happiness: 60,
      nutrition: 60,
      discipline: 60,
    };
    setDigipet(digipetTest);
    const digipetToMutate = getDigipet();

    // act
    digipetTest.happiness = 0;
    digipetToMutate!.nutrition = 0;

    expect(getDigipet()).toStrictEqual({
      happiness: 60,
      nutrition: 60,
      discipline: 60,
    });
  });
});

describe("updateDigipetBounded", () => {
  it("increases the specified stat when passed in a positive number", () => {
    const digipetTest: Digipet = {
      happiness: 60,
      nutrition: 60,
      discipline: 60,
    };
    setDigipet(digipetTest);

    updateDigipetBounded("happiness", 30);
    expect(getDigipet()).toStrictEqual({
      happiness: 90,
      nutrition: 60,
      discipline: 60,
    });

    updateDigipetBounded("nutrition", 25);
    expect(getDigipet()).toStrictEqual({
      happiness: 90,
      nutrition: 85,
      discipline: 60,
    });

    updateDigipetBounded("discipline", 0.5);
    expect(getDigipet()).toStrictEqual({
      happiness: 90,
      nutrition: 85,
      discipline: 60.5,
    });
  });

  it("decreases the specified stat when passed in a negative number", () => {
    const digipetTest: Digipet = {
      happiness: 60,
      nutrition: 60,
      discipline: 60,
    };
    setDigipet(digipetTest);

    updateDigipetBounded("happiness", -30);
    expect(getDigipet()).toStrictEqual({
      happiness: 30,
      nutrition: 60,
      discipline: 60,
    });

    updateDigipetBounded("nutrition", -25);
    expect(getDigipet()).toStrictEqual({
      happiness: 30,
      nutrition: 35,
      discipline: 60,
    });

    updateDigipetBounded("discipline", -0.5);
    expect(getDigipet()).toStrictEqual({
      happiness: 30,
      nutrition: 35,
      discipline: 59.5,
    });
  });

  it("bounds changes to a maximum final value of 100", () => {
    const digipetTest: Digipet = {
      happiness: 60,
      nutrition: 60,
      discipline: 60,
    };
    setDigipet(digipetTest);

    updateDigipetBounded("happiness", 1000000000);
    expect(getDigipet()).toStrictEqual({
      happiness: 100,
      nutrition: 60,
      discipline: 60,
    });

    updateDigipetBounded("nutrition", 40.1);
    expect(getDigipet()).toStrictEqual({
      happiness: 100,
      nutrition: 100,
      discipline: 60,
    });

    updateDigipetBounded("discipline", Infinity);
    expect(getDigipet()).toStrictEqual({
      happiness: 100,
      nutrition: 100,
      discipline: 100,
    });
  });

  it("bounds changes to a minimum final value of 0", () => {
    const digipetTest: Digipet = {
      happiness: 60,
      nutrition: 60,
      discipline: 60,
    };
    setDigipet(digipetTest);

    updateDigipetBounded("happiness", -1000000000);
    expect(getDigipet()).toStrictEqual({
      happiness: 0,
      nutrition: 60,
      discipline: 60,
    });

    updateDigipetBounded("nutrition", -60.1);
    expect(getDigipet()).toStrictEqual({
      happiness: 0,
      nutrition: 0,
      discipline: 60,
    });

    updateDigipetBounded("discipline", -Infinity);
    expect(getDigipet()).toStrictEqual({
      happiness: 0,
      nutrition: 0,
      discipline: 0,
    });
  });
});

describe("setDigipet", () => {
  it("reassigns userDigipet to passed in values (but not object reference)", () => {
    const sampleDigipet: Digipet = {
      happiness: 100,
      nutrition: 80,
      discipline: 30,
    };

    setDigipet(sampleDigipet);

    // same deep value after execution
    expect(getDigipet()).toStrictEqual(sampleDigipet);

    // does not assign reference - to prevent accidental mutation
    expect(getDigipet()).not.toBe(sampleDigipet);
  });
});
