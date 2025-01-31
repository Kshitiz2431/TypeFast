"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatServer = void 0;
const ws_1 = require("ws");
const user_1 = require("./user");
const redis_1 = require("./redis");
class ChatServer {
    pubSub;
    userManager;
    roomHosts;
    wss;
    constructor(httpServer) {
        this.pubSub = new redis_1.RedisManager();
        this.userManager = new user_1.UserManager();
        this.roomHosts = new Map();
        this.wss = new ws_1.WebSocketServer({ server: httpServer });
        this.wss.on("connection", this.handleConnection.bind(this));
        this.setupPubSub();
    }
    handleConnection(ws) {
        ws.on("error", console.error);
        ws.on("message", (data) => this.handleMessage(ws, data));
        ws.on("close", () => this.handleClose(ws));
    }
    setupPubSub() {
        this.pubSub.subscriber.on("message", (channel, message) => {
            const parsedMessage = JSON.parse(message);
            const users = this.userManager.getUsersInRoom(channel);
            users.forEach((user) => {
                user.ws.send(JSON.stringify(parsedMessage));
            });
        });
    }
    async handleMessage(ws, data) {
        try {
            const parsedData = JSON.parse(data.toString());
            const { type, userId, roomCode, userData } = parsedData;
            if (!this.userManager.getUser(userId)) {
                this.userManager.addUser(userId, ws, userData);
            }
            switch (type) {
                case "JOIN_ROOM":
                    await this.handleJoinRoom(userId, roomCode);
                    break;
                case "SEND_MESSAGE":
                    await this.handleSendMessage(userId, roomCode, parsedData.message);
                    break;
                case "START_RACE":
                    await this.handleStartRace(roomCode, parsedData.text);
                    break;
                case "UPDATE_PROGRESS":
                    await this.handleProgressUpdate(roomCode, userId, parsedData.progress);
                    break;
            }
        }
        catch (error) {
            console.error("Error processing message:", error);
        }
    }
    async handleJoinRoom(userId, roomCode) {
        try {
            const user = this.userManager.getUser(userId);
            if (!user) {
                throw new Error(`User with ID ${userId} not found`);
            }
            this.userManager.addUserToRoom(userId, roomCode);
            await this.pubSub.subscribe(roomCode);
            if (!this.roomHosts.has(roomCode)) {
                this.roomHosts.set(roomCode, userId);
            }
            const roomMembers = this.userManager
                .getAllUsers()
                .filter((u) => u.rooms.includes(roomCode))
                .map((u) => ({
                id: u.userId,
                name: u.name,
                image: u.image,
                isHost: u.userId === this.roomHosts.get(roomCode),
            }));
            this.pubSub.publish(roomCode, {
                type: "ROOM_MEMBERS",
                members: roomMembers,
            });
        }
        catch (error) {
            console.error(`Error handling join room for user ${userId}:`, error);
            throw error;
        }
    }
    async handleSendMessage(userId, roomCode, message) {
        try {
            const user = this.userManager.getUser(userId);
            if (!user) {
                throw new Error("User not found");
            }
            this.pubSub.publish(roomCode, {
                type: "MESSAGE",
                userId: userId,
                message: message,
                userData: {
                    name: user.name,
                    image: user.image,
                },
            });
        }
        catch (error) {
            console.error("Error handling send message:", error);
            throw error;
        }
    }
    async handleStartRace(roomCode, text) {
        try {
            const usersInRoom = this.userManager.getUsersInRoom(roomCode);
            if (!usersInRoom.length) {
                console.error("No users in room:", roomCode);
                return;
            }
            this.pubSub.publish(roomCode, {
                type: "RACE_START",
                timestamp: Date.now(),
                text,
            });
        }
        catch (error) {
            console.error("Error in handleStartRace:", error);
        }
    }
    async handleProgressUpdate(roomCode, userId, progress) {
        try {
            const usersInRoom = this.userManager.getUsersInRoom(roomCode);
            if (!usersInRoom.length) {
                console.error("No users in room for progress update:", roomCode);
                return;
            }
            const user = this.userManager.getUser(userId);
            if (!user) {
                console.error("User not found for progress update:", userId);
                return;
            }
            this.pubSub.publish(roomCode, {
                type: "PROGRESS_UPDATE",
                userId,
                progress,
                timestamp: Date.now(),
            });
        }
        catch (error) {
            console.error("Error in handleProgressUpdate:", error);
        }
    }
    handleClose(ws) {
        const userEntry = this.userManager.getUserByWs(ws);
        if (userEntry) {
            const [userId, user] = userEntry;
            const rooms = user.rooms;
            rooms.forEach((roomCode) => {
                this.pubSub.publish(roomCode, {
                    type: "MEMBER_LEFT",
                    memberId: userId,
                });
            });
            this.userManager.removeUser(userId);
        }
    }
}
exports.ChatServer = ChatServer;
