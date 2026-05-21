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
exports.ifFollowed = void 0;
const User_1 = __importDefault(require("../db/models/User"));
const ifFollowed = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    if (!username || !req.user) {
        res.status(400).send('Username of follower and following is required');
        return;
    }
    const profile = yield User_1.default.findOne({ username });
    const user = yield User_1.default.findById(req.user.id);
    if (!profile || !user) {
        res.status(404).send('User not found');
        return;
    }
    req.followed = profile.followers.includes(user._id);
    req.userProfile = user;
    req.profile = profile;
    next();
});
exports.ifFollowed = ifFollowed;
