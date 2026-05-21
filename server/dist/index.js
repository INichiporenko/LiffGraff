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
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const db_1 = __importDefault(require("./db"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const mainRouter_1 = require("./routes/mainRouter");
const cors_2 = require("./config/cors");
const socket_1 = require("./socket/socket");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const port = process.env.PORT || 3000;
(function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, db_1.default)();
            const app = (0, express_1.default)();
            const server = http_1.default.createServer(app);
            const corsOptions = (0, cors_2.configureCors)();
            app.use((0, cors_1.default)(corsOptions));
            app.use(express_1.default.json());
            app.use(express_1.default.urlencoded({ extended: true }));
            app.use((0, cookie_parser_1.default)());
            //Routes
            (0, mainRouter_1.mainRouter)(app);
            // Initialize Socket.IO
            (0, socket_1.initializeSocket)(server);
            server.listen(Number(port), '0.0.0.0', () => {
                console.log('Server is running on port http://localhost:' + port);
            });
        }
        catch (error) {
            console.error('Error starting server: ', error);
        }
    });
})();
