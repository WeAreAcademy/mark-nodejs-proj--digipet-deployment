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
 * This file has integration tests for feeding a digipet.
 *
 * It is intended to test two behaviours:
 *  1. feeding a digipet leads to increasing nutrition
 *  2. feeding a digipet leads to decreasing discipline
 */
describe.skip("When a user feeds a digipet repeatedly, its nutrition increases by 10 each time until it eventually maxes out at 100", () => {
    beforeAll(() => {
        // setup: give an initial digipet
        const startingDigipet = {
            happiness: 60,
            nutrition: 75,
            discipline: 60,
        };
        model_1.setDigipet(startingDigipet);
    });
    test("GET /digipet informs them that they have a digipet with expected stats", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet");
        expect(response.body.message).toMatch(/your digipet/i);
        expect(response.body.digipet).toHaveProperty("nutrition", 75);
    }));
    test("1st GET /digipet/feed informs them about the feed and shows increased nutrition for digipet", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/feed");
        expect(response.body.digipet).toHaveProperty("nutrition", 85);
    }));
    test("2nd GET /digipet/feed shows continued stats change", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/feed");
        expect(response.body.digipet).toHaveProperty("nutrition", 95);
    }));
    test("3rd GET /digipet/feed shows nutrition hitting a ceiling of 100", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/feed");
        expect(response.body.digipet).toHaveProperty("nutrition", 100);
    }));
    test("4th GET /digipet/feed shows no further increase in nutrition", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/feed");
        expect(response.body.digipet).toHaveProperty("nutrition", 100);
    }));
});
describe.skip("When a user feeds a digipet repeatedly, its discipline decreases by 5 each time until it eventually floors out at 0", () => {
    beforeAll(() => {
        // setup: give an initial digipet
        const startingDigipet = {
            happiness: 50,
            nutrition: 50,
            discipline: 11,
        };
        model_1.setDigipet(startingDigipet);
    });
    test("GET /digipet informs them that they have a digipet with expected stats", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet");
        expect(response.body.message).toMatch(/your digipet/i);
        expect(response.body.digipet).toHaveProperty("discipline", 11);
    }));
    test("1st GET /digipet/feed informs them about the feed and shows decreased discipline for digipet", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/feed");
        expect(response.body.digipet).toHaveProperty("discipline", 6);
    }));
    test("2nd GET /digipet/feed shows continued stats change", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/feed");
        expect(response.body.digipet).toHaveProperty("discipline", 1);
    }));
    test("3rd GET /digipet/feed shows discipline hitting a floor of 0", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/feed");
        expect(response.body.digipet).toHaveProperty("discipline", 0);
    }));
    test("4th GET /digipet/feed shows no further decrease in discipline", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/feed");
        expect(response.body.digipet).toHaveProperty("discipline", 0);
    }));
});
describe.skip("When a digipet is maxed out on nutrition, it is still possible to feed it and decrease its discipline", () => {
    beforeAll(() => {
        // setup: give an initial digipet
        const startingDigipet = {
            happiness: 50,
            nutrition: 100,
            discipline: 50,
        };
        model_1.setDigipet(startingDigipet);
    });
    test("GET /digipet informs them that they have a digipet with expected stats", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet");
        expect(response.body.message).toMatch(/your digipet/i);
        expect(response.body.digipet).toHaveProperty("nutrition", 100);
        expect(response.body.digipet).toHaveProperty("discipline", 50);
    }));
    test("GET /digipet/feed shows that nutrition remains at 100 but discipline has decreased", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/feed");
        expect(response.body.digipet).toHaveProperty("nutrition", 100);
        expect(response.body.digipet).toHaveProperty("discipline", 45);
    }));
});
