"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
class UserManager {
    users;
    constructor() {
        this.users = new Map();
    }
    addUser(userId, ws, userData) {
        const user = {
            userId,
            name: userData?.name || "Anonymous",
            image: userData?.image || null,
            ws,
            rooms: [],
        };
        this.users.set(userId, user);
    }
    getUser(userId) {
        return this.users.get(userId);
    }
    removeUser(userId) {
        this.users.delete(userId);
    }
    getUserByWs(ws) {
        for (const [userId, user] of this.users.entries()) {
            if (user.ws === ws)
                return [userId, user];
        }
        return null;
    }
    addUserToRoom(userId, roomId) {
        const user = this.users.get(userId);
        if (user && !user.rooms.includes(roomId)) {
            user.rooms.push(roomId);
        }
    }
    getUsersInRoom(roomId) {
        return Array.from(this.users.values()).filter((user) => user.rooms.includes(roomId));
    }
    getAllUsers() {
        return Array.from(this.users.values());
    }
    getUserCount() {
        return this.users.size;
    }
}
exports.UserManager = UserManager;
