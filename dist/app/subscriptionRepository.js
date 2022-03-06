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
exports.getAll = exports.deleteByEndpoint = exports.create = void 0;
const airtable_1 = __importDefault(require("airtable"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Voor nu even alles opslaan in Airtable, maar het gaat om het idee
var base = new airtable_1.default({ apiKey: process.env.AIRTABLE_API_KEY }).base('appa2Px7d069LPUut');
const create = (subscription) => __awaiter(void 0, void 0, void 0, function* () {
    const savedSubscription = yield base('Table 1').create(subscription);
    console.log(savedSubscription.get('keys'));
    const keys = JSON.parse(savedSubscription.get('keys'));
    return {
        id: savedSubscription.getId(),
        endpoint: savedSubscription.get('endpoint'),
        expirationTime: savedSubscription.get('expirationTime'),
        keys,
    };
});
exports.create = create;
const deleteByEndpoint = (endpoint) => __awaiter(void 0, void 0, void 0, function* () {
    // const result = await Subscription.remove({ endpoint });
    // return result.ok === 1 && result.deletedCount > 0;
    console.log('Delete');
    return true;
});
exports.deleteByEndpoint = deleteByEndpoint;
const getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const records = yield base('Table 1').select({ view: 'Grid view' }).all();
    return records.map((rec) => {
        const keys = JSON.parse(rec.get('keys'));
        return {
            id: rec.getId(),
            endpoint: rec.get('endpoint'),
            expirationTime: rec.get('expirationTime'),
            keys,
        };
    });
});
exports.getAll = getAll;
//# sourceMappingURL=subscriptionRepository.js.map