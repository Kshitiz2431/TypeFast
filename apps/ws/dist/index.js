"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = require("node:http");
const chat_1 = require("./services/chat");
const express_1 = __importDefault(require("express"));
const PORT = 8080;
const app = (0, express_1.default)();
const httpServer = (0, node_http_1.createServer)(app);
new chat_1.ChatServer(httpServer);
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
