"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const model_1 = require("../digipet/model");
const server_1 = __importDefault(require("../server"));
/**
 * This file has integration tests for walking a digipet.
 *
 * It is intended to test two behaviours:
 *  1. walking a digipet leads to increasing happiness
 *  2. walking a digipet leads to decreasing nutrition
 *
 * These have been mostly separated out into two different E2E tests to try to make the tests more robust - it is possible that we might want a change in one but not the other, and it would be annoying to have to fix tests on increasing happiness when there's a change in intended nutrition behaviour.
 */
describe("When a user walks a digipet repeatedly, its happiness increases by 10 each time until it eventually maxes out at 100", () => {
    beforeAll(() => {
        // setup: give an initial digipet
        const startingDigipet = {
            happiness: 75,
            nutrition: 80,
            discipline: 60,
        };
        model_1.setDigipet(startingDigipet);
    });
    test("GET /digipet informs them that they have a digipet with expected stats", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet");
        expect(response.body.message).toMatch(/your digipet/i);
        expect(response.body.digipet).toHaveProperty("happiness", 75);
    }));
    test("1st GET /digipet/walk informs them about the walk and shows increase happiness", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/walk");
        expect(response.body.digipet).toHaveProperty("happiness", 85);
    }));
    test("2nd GET /digipet/walk shows continued stats change", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/walk");
        expect(response.body.digipet).toHaveProperty("happiness", 95);
    }));
    test("3rd GET /digipet/walk shows happiness hitting a ceiling of 100", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/walk");
        expect(response.body.digipet).toHaveProperty("happiness", 100);
    }));
    test("4th GET /digipet/walk shows no further increase in happiness", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/walk");
        expect(response.body.digipet).toHaveProperty("happiness", 100);
    }));
});
describe("When a user walks a digipet repeatedly, its nutrition decreases by 5 each time until it eventually floors out at 0", () => {
    beforeAll(() => {
        // setup: give an initial digipet
        const startingDigipet = {
            happiness: 40,
            nutrition: 11,
            discipline: 60,
        };
        model_1.setDigipet(startingDigipet);
    });
    test("GET /digipet informs them that they have a digipet with expected stats", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet");
        expect(response.body.message).toMatch(/your digipet/i);
        expect(response.body.digipet).toHaveProperty("nutrition", 11);
    }));
    test("1st GET /digipet/walk informs them about the walk and shows decreased nutrition for digipet", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/walk");
        expect(response.body.digipet).toHaveProperty("nutrition", 6);
    }));
    test("2nd GET /digipet/walk shows continued stats change", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/walk");
        expect(response.body.digipet).toHaveProperty("nutrition", 1);
    }));
    test("3rd GET /digipet/walk shows nutrition hitting a floor of 0", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/walk");
        expect(response.body.digipet).toHaveProperty("nutrition", 0);
    }));
    test("4th GET /digipet/walk shows no further decrease in nutrition", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/walk");
        expect(response.body.digipet).toHaveProperty("nutrition", 0);
    }));
});
describe("When a digipet is maxed out on happiness, it is still possible to walk it and decrease its nutrition", () => {
    beforeAll(() => {
        // setup: give an initial digipet
        const startingDigipet = {
            happiness: 100,
            nutrition: 50,
            discipline: 50,
        };
        model_1.setDigipet(startingDigipet);
    });
    test("GET /digipet informs them that they have a digipet with expected stats", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet");
        expect(response.body.message).toMatch(/your digipet/i);
        expect(response.body.digipet).toHaveProperty("happiness", 100);
        expect(response.body.digipet).toHaveProperty("nutrition", 50);
    }));
    test("GET /digipet/walk shows that happiness remains at 100 but nutrition has decreased", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/walk");
        expect(response.body.digipet).toHaveProperty("happiness", 100);
        expect(response.body.digipet).toHaveProperty("nutrition", 45);
    }));
});
