"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web_push_1 = __importDefault(require("web-push"));
const publicVapidKey = 'BNodLgNO2YdnKllWbx8oxTOQqr9J0jh5IvQ1lfI5Wgsfdt8p-RXpZ5T6qRQFjNmYnJ7uPFQEI9v0eQ06nCYsRGg';
const privateVapidKey = '6QdJDETcKf_QG6R6Z6VgqHxE9mQvgd2WXCc0tIfrrUo';
exports.default = () => {
    web_push_1.default.setVapidDetails('mailto:sebastiaan@benjami.in', publicVapidKey, privateVapidKey);
};
//# sourceMappingURL=webpushConfig.js.map