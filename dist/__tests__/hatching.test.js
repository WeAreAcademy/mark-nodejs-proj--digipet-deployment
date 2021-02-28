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
describe("User can hatch a digipet and inspect it when they don't currently have one, but they can only hatch one digipet", () => {
    // setup: ensure there is no digipet to begin with
    model_1.setDigipet(undefined);
    test("1st GET /digipet informs them that they don't currently have a digipet", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet");
        expect(response.body.message).toMatch(/don't have/i);
        expect(response.body.digipet).not.toBeDefined();
    }));
    test("1st GET /digipet/hatch informs them that they have hatched a digipet and includes initial digipet data", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/hatch");
        expect(response.body.message).toMatch(/success/i);
        expect(response.body.message).toMatch(/hatch/i);
        expect(response.body.digipet).toHaveProperty("happiness", model_1.INITIAL_DIGIPET.happiness);
        expect(response.body.digipet).toHaveProperty("nutrition", model_1.INITIAL_DIGIPET.nutrition);
        expect(response.body.digipet).toHaveProperty("discipline", model_1.INITIAL_DIGIPET.discipline);
    }));
    test("2nd GET /digipet now informs them that they don't currently have a digipet", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet");
        expect(response.body.message).toMatch(/your digipet/i);
        expect(response.body.digipet).toBeDefined();
    }));
    test("2nd GET /digipet/hatch now informs them that they can't hatch another digipet whilst they still have one", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/hatch");
        expect(response.body.message).not.toMatch(/success/i);
        expect(response.body.message).toMatch(/can't hatch/i);
        expect(response.body.digipet).toHaveProperty("happiness", model_1.INITIAL_DIGIPET.happiness);
        expect(response.body.digipet).toHaveProperty("nutrition", model_1.INITIAL_DIGIPET.nutrition);
        expect(response.body.digipet).toHaveProperty("discipline", model_1.INITIAL_DIGIPET.discipline);
    }));
});
