"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walkDigipet = exports.trainDigipet = exports.hatchDigipet = exports.feedDigipet = void 0;
const model_1 = require("./model");
/**
 * The actions that your Digipet game supports.
 *
 * These update the underlying digipet by using the functions defined in model.ts
 */
function feedDigipet() { }
exports.feedDigipet = feedDigipet;
function hatchDigipet() {
    if (model_1.getDigipet()) {
        throw new Error("Can't hatch a digipet when you already have one!");
    }
    else {
        // spread to avoid accidental mutation
        const newDigipet = Object.assign({}, model_1.INITIAL_DIGIPET);
        model_1.setDigipet(newDigipet);
        return newDigipet;
    }
}
exports.hatchDigipet = hatchDigipet;
function trainDigipet() { }
exports.trainDigipet = trainDigipet;
function walkDigipet() {
    model_1.updateDigipetBounded("happiness", 10);
    model_1.updateDigipetBounded("nutrition", -5);
}
exports.walkDigipet = walkDigipet;
