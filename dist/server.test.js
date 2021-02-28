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
const controller_1 = require("./digipet/controller");
const model_1 = require("./digipet/model");
const server_1 = __importDefault(require("./server"));
/**
 * The below line mock all imports from './digipet/controller'.
 *
 * We're mocking here for separation of concerns - we're testing the rough structure of server responses and whether they're calling the right controllers, but we don't care here what the controllers do.
 *
 * (There's a separate suite of integration tests that tests endpoint responses _and_ side effects.)
 *
 * On mocking: https://circleci.com/blog/how-to-test-software-part-i-mocking-stubbing-and-contract-testing/
 *
 * On mocking in jest: https://jestjs.io/docs/en/jest-object#jestmockmodulename-factory-options
 */
jest.mock("./digipet/controller");
describe("GET /", () => {
    it("provides a nod to instructions in the response body", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/");
        expect(response.body.message).toMatch("/instructions");
    }));
});
describe("GET /instructions", () => {
    it("responds with a message that has important keywords", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/instructions");
        const keywords = ["/digipet", "hatch", "feed", "ignore", "train", "walk"];
        for (let keyword of keywords) {
            // check the keyword is mentioned in the response body
            expect(response.body.message).toMatch(keyword);
        }
    }));
});
describe("GET /digipet", () => {
    test("if the user has a digipet, it responds with the digipet data and a message about the user's digipet", () => __awaiter(void 0, void 0, void 0, function* () {
        model_1.setDigipet(model_1.INITIAL_DIGIPET);
        const response = yield supertest_1.default(server_1.default).get("/digipet");
        expect(response.body.digipet).toStrictEqual(model_1.INITIAL_DIGIPET);
        expect(response.body.message).toMatch(/your digipet/i);
    }));
    test("if the user has no digipet, it responds with a message about not having a digipet", () => __awaiter(void 0, void 0, void 0, function* () {
        model_1.setDigipet(undefined);
        const response = yield supertest_1.default(server_1.default).get("/digipet");
        expect(response.body.digipet).not.toBeDefined();
        expect(response.body.message).toMatch(/don't have/i);
    }));
});
describe("GET /digipet/hatch", () => {
    test("if the user has a digipet, it responds with a message explaining that a digipet can't be hatched whilst the user has another", () => __awaiter(void 0, void 0, void 0, function* () {
        // setup
        if (jest.isMockFunction(controller_1.hatchDigipet) /* type guard */) {
            controller_1.hatchDigipet.mockReset();
        }
        model_1.setDigipet(model_1.INITIAL_DIGIPET);
        // act
        const response = yield supertest_1.default(server_1.default).get("/digipet/hatch");
        // assert
        expect(response.body.message).toMatch(/can't hatch/i);
        expect(controller_1.hatchDigipet).toHaveBeenCalledTimes(0);
    }));
    test("if the user has no digipet, it responds with a message about successfully hatching a digipet and calls hatchDigipet", () => __awaiter(void 0, void 0, void 0, function* () {
        // setup
        if (jest.isMockFunction(controller_1.hatchDigipet) /* type guard */) {
            controller_1.hatchDigipet.mockReset();
        }
        model_1.setDigipet(undefined);
        // act
        const response = yield supertest_1.default(server_1.default).get("/digipet/hatch");
        // assert
        expect(response.body.message).toMatch(/success/i);
        expect(response.body.message).toMatch(/hatch/i);
        expect(controller_1.hatchDigipet).toHaveBeenCalledTimes(1);
    }));
});
describe("action routes", () => {
    test("when the user does not have a digipet, action routes direct them to hatch a digipet and do not call their relevant controllers", () => __awaiter(void 0, void 0, void 0, function* () {
        const routesAndControllers = {
            /* test for these once written */
            // "/digipet/feed": feedDigipet,
            // '/digipet/train': trainDigipet,
            "/digipet/walk": controller_1.walkDigipet,
        };
        for (let [route, controller] of Object.entries(routesAndControllers)) {
            // reset mock of the controller
            if (jest.isMockFunction(controller) /* type guard */) {
                controller.mockReset();
            }
            model_1.setDigipet(undefined);
            const response = yield supertest_1.default(server_1.default).get(route);
            expect(response.body.message).toMatch(/you don't have/i);
            expect(response.body.message).toMatch(/try/i);
            // suggest a helpful endpoint
            expect(response.body.message).toMatch("/digipet/hatch");
            // expect relevant controller not to have been called
            expect(controller).toHaveBeenCalledTimes(0);
        }
    }));
    describe.skip("GET /digipet/feed", () => {
        test("if the user has a digipet, it calls the feedDigipet controller and responds with a message about feeding the digipet", () => __awaiter(void 0, void 0, void 0, function* () {
            // setup: reset digipet
            model_1.setDigipet(model_1.INITIAL_DIGIPET);
            const response = yield supertest_1.default(server_1.default).get("/digipet/feed");
            // response includes a relevant message
            expect(response.body.message).toMatch(/feed/i);
            // response includes digipet data
            expect(response.body.digipet).toHaveProperty("happiness");
            expect(response.body.digipet).toHaveProperty("nutrition");
            expect(response.body.digipet).toHaveProperty("discipline");
        }));
        it("delegates state change to the feedDigipet function", () => __awaiter(void 0, void 0, void 0, function* () {
            // setup: reset digipet and mock function
            model_1.setDigipet(model_1.INITIAL_DIGIPET);
            if (jest.isMockFunction(controller_1.feedDigipet) /* type guard */) {
                controller_1.feedDigipet.mockReset();
            }
            // act
            yield supertest_1.default(server_1.default).get("/digipet/feed");
            // assert
            expect(controller_1.feedDigipet).toHaveBeenCalledTimes(1);
        }));
    });
    describe.skip("GET /digipet/train", () => {
        test("if the user has a digipet, it calls the trainDigipet controller and responds with a message about training the digipet", () => __awaiter(void 0, void 0, void 0, function* () {
            // setup: reset digipet
            model_1.setDigipet(model_1.INITIAL_DIGIPET);
            const response = yield supertest_1.default(server_1.default).get("/digipet/train");
            // mock function has been called once
            // response includes a relevant message
            expect(response.body.message).toMatch(/train/i);
            // response includes digipet data
            expect(response.body.digipet).toHaveProperty("happiness");
            expect(response.body.digipet).toHaveProperty("nutrition");
            expect(response.body.digipet).toHaveProperty("discipline");
        }));
        it("delegates state change to the trainDigipet function", () => __awaiter(void 0, void 0, void 0, function* () {
            // setup: reset digipet and mock function
            model_1.setDigipet(model_1.INITIAL_DIGIPET);
            if (jest.isMockFunction(controller_1.trainDigipet) /* type guard */) {
                controller_1.trainDigipet.mockReset();
            }
            // act
            yield supertest_1.default(server_1.default).get("/digipet/train");
            // assert
            expect(controller_1.trainDigipet).toHaveBeenCalledTimes(1);
        }));
    });
    describe("GET /digipet/walk", () => {
        test("if the user has a digipet, it responds with a message about the walk", () => __awaiter(void 0, void 0, void 0, function* () {
            // setup: reset digipet
            model_1.setDigipet(model_1.INITIAL_DIGIPET);
            const response = yield supertest_1.default(server_1.default).get("/digipet/walk");
            // response includes a relevant message
            expect(response.body.message).toMatch(/walk/i);
            // response includes digipet data
            expect(response.body.digipet).toHaveProperty("happiness");
            expect(response.body.digipet).toHaveProperty("nutrition");
            expect(response.body.digipet).toHaveProperty("discipline");
        }));
        it("delegates state change to the walkDigipet function", () => __awaiter(void 0, void 0, void 0, function* () {
            // setup: reset digipet and mock function
            model_1.setDigipet(model_1.INITIAL_DIGIPET);
            if (jest.isMockFunction(controller_1.walkDigipet) /* type guard */) {
                controller_1.walkDigipet.mockReset();
            }
            // act
            yield supertest_1.default(server_1.default).get("/digipet/walk");
            // assert
            expect(controller_1.walkDigipet).toHaveBeenCalledTimes(1);
        }));
    });
});
