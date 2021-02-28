"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("./controller");
const model_1 = require("./model");
describe.skip("feedDigipet", () => {
    it("increases digipet nutrition by 10 and decreases discipline by 5", () => {
        // setup
        model_1.setDigipet(model_1.INITIAL_DIGIPET);
        expect(model_1.getDigipet()).toStrictEqual(model_1.INITIAL_DIGIPET);
        // act
        controller_1.feedDigipet();
        // assert
        expect(model_1.getDigipet()).toStrictEqual({
            happiness: model_1.INITIAL_DIGIPET.happiness,
            nutrition: model_1.INITIAL_DIGIPET.nutrition + 10,
            discipline: model_1.INITIAL_DIGIPET.discipline - 5,
        });
    });
    it("cannot increase nutrition past 100", () => {
        // setup
        model_1.setDigipet({ happiness: 50, nutrition: 95, discipline: 50 });
        // act
        controller_1.feedDigipet();
        // assert
        expect(model_1.getDigipet()).toHaveProperty("nutrition", 100);
    });
    it("cannot decrease discipline below 0", () => {
        // setup
        model_1.setDigipet({ happiness: 50, nutrition: 50, discipline: 0 });
        // act
        controller_1.feedDigipet();
        // assert
        expect(model_1.getDigipet()).toHaveProperty("discipline", 0);
    });
});
describe("hatchDigipet", () => {
    test("when there is no current digipet, it creates a digipet with default initial values and returns it", () => {
        // setup
        model_1.setDigipet(undefined);
        // act
        const digipet = controller_1.hatchDigipet();
        // assert
        expect(digipet).toStrictEqual(model_1.INITIAL_DIGIPET);
        expect(model_1.getDigipet()).toStrictEqual(model_1.INITIAL_DIGIPET);
    });
    test("when there is a current digipet, it throws an error", () => {
        // setup
        model_1.setDigipet({ happiness: 50, nutrition: 50, discipline: 50 });
        // assert error gets thrown
        expect(() => controller_1.hatchDigipet()).toThrowError();
    });
});
describe.skip("trainDigipet", () => {
    it("increases digipet discipline by 10 and decreases happiness by 5", () => {
        // setup
        model_1.setDigipet(model_1.INITIAL_DIGIPET);
        expect(model_1.getDigipet()).toStrictEqual(model_1.INITIAL_DIGIPET);
        // act
        controller_1.trainDigipet();
        // assert
        expect(model_1.getDigipet()).toStrictEqual({
            happiness: model_1.INITIAL_DIGIPET.happiness - 5,
            nutrition: model_1.INITIAL_DIGIPET.nutrition,
            discipline: model_1.INITIAL_DIGIPET.discipline + 10,
        });
    });
    it("cannot increase discipline past 100", () => {
        // setup
        model_1.setDigipet({ happiness: 50, nutrition: 50, discipline: 95 });
        // act
        controller_1.trainDigipet();
        // assert
        expect(model_1.getDigipet()).toHaveProperty("discipline", 100);
    });
    it("cannot decrease happiness below 0", () => {
        // setup
        model_1.setDigipet({ happiness: 0, nutrition: 50, discipline: 50 });
        // act
        controller_1.trainDigipet();
        // assert
        expect(model_1.getDigipet()).toHaveProperty("happiness", 0);
    });
});
describe("walkDigipet", () => {
    it("increases digipet happiness by 10 and decreases nutrition by 5 (to represent need for sustenance)", () => {
        // setup
        model_1.setDigipet(model_1.INITIAL_DIGIPET);
        expect(model_1.getDigipet()).toStrictEqual(model_1.INITIAL_DIGIPET);
        // act
        controller_1.walkDigipet();
        // assert
        expect(model_1.getDigipet()).toStrictEqual({
            happiness: model_1.INITIAL_DIGIPET.happiness + 10,
            nutrition: model_1.INITIAL_DIGIPET.nutrition - 5,
            discipline: model_1.INITIAL_DIGIPET.discipline,
        });
    });
    it("cannot increase happiness past 100", () => {
        // setup
        model_1.setDigipet({ happiness: 95, nutrition: 50, discipline: 50 });
        // act
        controller_1.walkDigipet();
        // assert
        expect(model_1.getDigipet()).toHaveProperty("happiness", 100);
    });
    it("cannot decrease nutrition below 0", () => {
        // setup
        model_1.setDigipet({ happiness: 50, nutrition: 0, discipline: 50 });
        // act
        controller_1.walkDigipet();
        // assert
        expect(model_1.getDigipet()).toHaveProperty("nutrition", 0);
    });
});
