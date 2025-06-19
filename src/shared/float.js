"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fadd = add;
exports.fsub = sub;
exports.fmul = mul;
exports.fdiv = div;
function multiply(a, b) {
    var c = 0;
    var d = a.toString();
    var e = b.toString();
    try {
        c += d.split(".")[1].length;
    }
    catch (f) { }
    try {
        c += e.split(".")[1].length;
    }
    catch (f) { }
    return ((Number(d.replace(".", "")) * Number(e.replace(".", ""))) / Math.pow(10, c));
}
function mul() {
    return multiply.apply(this, arguments);
}
function subtract(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    }
    catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    }
    catch (f) {
        d = 0;
    }
    return ((e = Math.pow(10, Math.max(c, d))), (multiply(a, e) - multiply(b, e)) / e);
}
function sub() {
    return subtract.apply(this, arguments);
}
function add(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    }
    catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    }
    catch (f) {
        d = 0;
    }
    return ((e = Math.pow(10, Math.max(c, d))), (multiply(a, e) + multiply(b, e)) / e);
}
function divide(a, b) {
    var c, d, e = 0, f = 0;
    try {
        e = a.toString().split(".")[1].length;
    }
    catch (g) { }
    try {
        f = b.toString().split(".")[1].length;
    }
    catch (g) { }
    return ((c = Number(a.toString().replace(".", ""))),
        (d = Number(b.toString().replace(".", ""))),
        multiply(c / d, Math.pow(10, f - e)));
}
function div() {
    return divide.apply(this, arguments);
}
