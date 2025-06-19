"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeDeep = exports.isObject = void 0;
var isObject = function (item) {
    return item && typeof item === "object" && !Array.isArray(item);
};
exports.isObject = isObject;
var mergeDeep = function (target, source) {
    var output = Object.assign({}, target);
    if ((0, exports.isObject)(target) && (0, exports.isObject)(source)) {
        Object.keys(source).forEach(function (key) {
            var _a, _b;
            if ((0, exports.isObject)(source[key])) {
                if (!(key in target))
                    Object.assign(output, (_a = {}, _a[key] = source[key], _a));
                else
                    output[key] = (0, exports.mergeDeep)(target[key], source[key]);
            }
            else {
                Object.assign(output, (_b = {}, _b[key] = source[key], _b));
            }
        });
    }
    return output;
};
exports.mergeDeep = mergeDeep;
