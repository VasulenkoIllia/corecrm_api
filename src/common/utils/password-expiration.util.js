"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPasswordExpired = void 0;
var isPasswordExpired = function (passwordExpirationDate) {
    return new Date(passwordExpirationDate) < new Date();
};
exports.isPasswordExpired = isPasswordExpired;
