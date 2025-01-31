import { User } from "@repo/common/types";
import WebSocket from "ws";
export declare class UserManager {
    private users;
    constructor();
    addUser(userId: string, ws: WebSocket, userData?: {
        name: string;
        image: string | null;
    }): void;
    getUser(userId: string): User | undefined;
    removeUser(userId: string): void;
    getUserByWs(ws: WebSocket): [string, User] | null;
    addUserToRoom(userId: string, roomId: string): void;
    getUsersInRoom(roomId: string): User[];
    getAllUsers(): User[];
    getUserCount(): number;
}
//# sourceMappingURL=user.d.ts.map