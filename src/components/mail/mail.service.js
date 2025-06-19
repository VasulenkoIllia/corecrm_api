"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
var common_1 = require("@nestjs/common");
var nodemailer = require("nodemailer");
var fs = require("fs");
var path = require("path");
var MailService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var MailService = _classThis = /** @class */ (function () {
        function MailService_1(configService) {
            this.configService = configService;
            this.logger = new common_1.Logger(MailService.name);
            // Initialize SMTP transporter
            var gmailUser = this.configService.get('SMTP_GMAIL_USER');
            var gmailPass = this.configService.get('SMTP_GMAIL_PASS');
            var smtpHost = this.configService.get('SMTP_HOST');
            var smtpSenderEmail = this.configService.get('SMTP_SENDER_EMAIL');
            if (gmailUser && gmailPass) {
                this.logger.log('Initializing MailService with Gmail SMTP configuration');
                this.transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: gmailUser,
                        pass: gmailPass,
                    },
                });
            }
            else if (smtpHost && smtpSenderEmail) {
                this.logger.log("Initializing MailService with generic SMTP configuration: ".concat(smtpHost));
                this.transporter = nodemailer.createTransport({
                    host: smtpHost,
                    port: this.configService.get('SMTP_PORT', 465),
                    secure: this.configService.get('SMTP_USE_SSL', true),
                    auth: {
                        user: this.configService.get('SMTP_USER_NAME'),
                        pass: this.configService.get('SMTP_PASSWORD'),
                    },
                    tls: {
                        minVersion: 'TLSv1.2',
                        rejectUnauthorized: false,
                    },
                    debug: true,
                    logger: true,
                });
            }
            else {
                this.logger.error('Missing required SMTP configuration: either Gmail (SMTP_GMAIL_USER, SMTP_GMAIL_PASS) or generic SMTP (SMTP_HOST, SMTP_SENDER_EMAIL) settings must be provided');
                throw new Error('SMTP configuration is incomplete');
            }
            // Load email templates
            this.templates = this.loadTemplates();
        }
        MailService_1.prototype.sendConfirmationEmail = function (email, token) {
            return __awaiter(this, void 0, void 0, function () {
                var confirmationUrl, smtpSenderEmail, projectName, template, html, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            confirmationUrl = "".concat(this.configService.get('BASE_SITE_URL'), "/auth/confirm-email?token=").concat(token);
                            smtpSenderEmail = this.configService.get('SMTP_SENDER_EMAIL', 'noreply@example.com');
                            projectName = this.configService.get('PROJECT_NAME', 'Your App');
                            this.logger.log("Sending confirmation email to ".concat(email, " from ").concat(smtpSenderEmail));
                            template = this.templates['confirmation-email.template.html'];
                            html = this.replacePlaceholders(template, {
                                confirmationUrl: confirmationUrl,
                                projectName: projectName,
                            });
                            return [4 /*yield*/, this.transporter.sendMail({
                                    from: smtpSenderEmail,
                                    to: email,
                                    subject: 'Confirm Your Email',
                                    html: html,
                                })];
                        case 1:
                            _a.sent();
                            this.logger.log("Confirmation email sent to ".concat(email));
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            this.logger.error("Failed to send confirmation email to ".concat(email, ": ").concat(error_1.message));
                            throw new Error("Failed to send confirmation email: ".concat(error_1.message));
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        MailService_1.prototype.sendInvitationEmail = function (email, token, companyName) {
            return __awaiter(this, void 0, void 0, function () {
                var inviteUrl, smtpSenderEmail, projectName, template, html, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            inviteUrl = "".concat(this.configService.get('BASE_SITE_URL'), "/auth/invite/").concat(token);
                            smtpSenderEmail = this.configService.get('SMTP_SENDER_EMAIL', 'noreply@example.com');
                            projectName = this.configService.get('PROJECT_NAME', 'Your App');
                            this.logger.log("Sending invitation email to ".concat(email, " from ").concat(smtpSenderEmail));
                            template = this.templates['invitation-email.template.html'];
                            html = this.replacePlaceholders(template, {
                                inviteUrl: inviteUrl,
                                companyName: companyName,
                                projectName: projectName,
                            });
                            return [4 /*yield*/, this.transporter.sendMail({
                                    from: smtpSenderEmail,
                                    to: email,
                                    subject: "Invitation to join ".concat(companyName),
                                    html: html,
                                })];
                        case 1:
                            _a.sent();
                            this.logger.log("Invitation email sent to ".concat(email, " for company ").concat(companyName));
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _a.sent();
                            this.logger.error("Failed to send invitation email to ".concat(email, ": ").concat(error_2.message));
                            throw new Error("Failed to send invitation email: ".concat(error_2.message));
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        MailService_1.prototype.sendPasswordResetEmail = function (email, token) {
            return __awaiter(this, void 0, void 0, function () {
                var resetUrl, smtpSenderEmail, projectName, template, html, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            resetUrl = "".concat(this.configService.get('BASE_SITE_URL'), "/auth/reset-password?token=").concat(token);
                            smtpSenderEmail = this.configService.get('SMTP_SENDER_EMAIL', 'noreply@example.com');
                            projectName = this.configService.get('PROJECT_NAME', 'Your App');
                            this.logger.log("Sending password reset email to ".concat(email, " from ").concat(smtpSenderEmail));
                            template = this.templates['password-reset-email.template.html'];
                            html = this.replacePlaceholders(template, {
                                resetUrl: resetUrl,
                                projectName: projectName,
                            });
                            return [4 /*yield*/, this.transporter.sendMail({
                                    from: smtpSenderEmail,
                                    to: email,
                                    subject: 'Reset Your Password',
                                    html: html,
                                })];
                        case 1:
                            _a.sent();
                            this.logger.log("Password reset email sent to ".concat(email));
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _a.sent();
                            this.logger.error("Failed to send password reset email to ".concat(email, ": ").concat(error_3.message));
                            throw new Error("Failed to send password reset email: ".concat(error_3.message));
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        MailService_1.prototype.loadTemplates = function () {
            var templateDir = path.join(process.cwd(), 'src', 'infrastructure', 'mail', 'templates');
            var templateFiles = [
                'confirmation-email.template.html',
                'invitation-email.template.html',
                'password-reset-email.template.html',
            ];
            var templates = {};
            for (var _i = 0, templateFiles_1 = templateFiles; _i < templateFiles_1.length; _i++) {
                var file = templateFiles_1[_i];
                try {
                    var filePath = path.join(templateDir, file);
                    var content = fs.readFileSync(filePath, 'utf-8');
                    templates[file] = content;
                    this.logger.log("Loaded template: ".concat(file));
                }
                catch (error) {
                    this.logger.error("Failed to load template ".concat(file, ": ").concat(error.message));
                    throw new Error("Failed to load template ".concat(file, ": ").concat(error.message));
                }
            }
            return templates;
        };
        MailService_1.prototype.replacePlaceholders = function (template, placeholders) {
            var result = template;
            for (var _i = 0, _a = Object.entries(placeholders); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                result = result.replace(new RegExp("{{".concat(key, "}}"), 'g'), value);
            }
            return result;
        };
        return MailService_1;
    }());
    __setFunctionName(_classThis, "MailService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MailService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MailService = _classThis;
}();
exports.MailService = MailService;
