"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const webpushConfig_1 = __importDefault(require("./webpushConfig"));
const subscriptionController_1 = require("./subscriptionController");
const app = (0, express_1.default)();
// Serve all files in client
app.use(express_1.default.static(path_1.default.join(__dirname, '../client')));
app.use(body_parser_1.default.json());
app.post('/subscription', subscriptionController_1.post);
app.delete('/subscription', subscriptionController_1.remove);
app.get('/broadcast', subscriptionController_1.broadcast);
(0, webpushConfig_1.default)();
// start the Express server
app.listen(process.env.PORT || 8080, () => {
    console.log(`server started at http://localhost:${8080}`);
});
//# sourceMappingURL=index.js.map