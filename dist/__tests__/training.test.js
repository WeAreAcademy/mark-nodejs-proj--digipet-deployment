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
 * This file has integration tests for training a digipet.
 *
 * It is intended to test two behaviours:
 *  1. training a digipet leads to increasing discipline
 *  2. training a digipet leads to decreasing happiness
 */
describe.skip("When a user trains a digipet repeatedly, its discipline increases by 10 each time until it eventually maxes out at 100", () => {
    beforeAll(() => {
        // setup: give an initial digipet
        const startingDigipet = {
            happiness: 60,
            nutrition: 80,
            discipline: 75,
        };
        model_1.setDigipet(startingDigipet);
    });
    test("GET /digipet informs them that they have a digipet with expected stats", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet");
        expect(response.body.message).toMatch(/your digipet/i);
        expect(response.body.digipet).toHaveProperty("discipline", 75);
    }));
    test("1st GET /digipet/train informs them about the train and shows increase discipline for digipet", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/train");
        expect(response.body.digipet).toHaveProperty("discipline", 85);
    }));
    test("2nd GET /digipet/train shows continued stats change", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/train");
        expect(response.body.digipet).toHaveProperty("discipline", 95);
    }));
    test("3rd GET /digipet/train shows discipline hitting a ceiling of 100", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/train");
        expect(response.body.digipet).toHaveProperty("discipline", 100);
    }));
    test("4th GET /digipet/train shows no further increase in discipline", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/train");
        expect(response.body.digipet).toHaveProperty("discipline", 100);
    }));
});
describe.skip("When a user trains a digipet repeatedly, its happiness decreases by 5 each time until it eventually floors out at 0", () => {
    beforeAll(() => {
        // setup: give an initial digipet
        const startingDigipet = {
            happiness: 11,
            nutrition: 50,
            discipline: 50,
        };
        model_1.setDigipet(startingDigipet);
    });
    test("GET /digipet informs them that they have a digipet with expected stats", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet");
        expect(response.body.message).toMatch(/your digipet/i);
        expect(response.body.digipet).toHaveProperty("happiness", 11);
    }));
    test("1st GET /digipet/train informs them about the train and shows decreased happiness for digipet", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/train");
        expect(response.body.digipet).toHaveProperty("happiness", 6);
    }));
    test("2nd GET /digipet/train shows continued stats change", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/train");
        expect(response.body.digipet).toHaveProperty("happiness", 1);
    }));
    test("3rd GET /digipet/train shows happiness hitting a floor of 0", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/train");
        expect(response.body.digipet).toHaveProperty("happiness", 0);
    }));
    test("4th GET /digipet/train shows no further decrease in happiness", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/train");
        expect(response.body.digipet).toHaveProperty("happiness", 0);
    }));
});
describe.skip("When a digipet is maxed out on discipline, it is still possible to train it and decrease its happiness", () => {
    beforeAll(() => {
        // setup: give an initial digipet
        const startingDigipet = {
            happiness: 50,
            nutrition: 50,
            discipline: 100,
        };
        model_1.setDigipet(startingDigipet);
    });
    test("GET /digipet informs them that they have a digipet with expected stats", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet");
        expect(response.body.message).toMatch(/your digipet/i);
        expect(response.body.digipet).toHaveProperty("discipline", 100);
        expect(response.body.digipet).toHaveProperty("happiness", 50);
    }));
    test("GET /digipet/train shows that discipline remains at 100 but happiness has decreased", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/train");
        expect(response.body.digipet).toHaveProperty("discipline", 100);
        expect(response.body.digipet).toHaveProperty("happiness", 45);
    }));
});
