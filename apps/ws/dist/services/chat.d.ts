import { Server } from "node:http";
export declare class ChatServer {
    private pubSub;
    private userManager;
    private roomHosts;
    private wss;
    constructor(httpServer: Server);
    private handleConnection;
    private setupPubSub;
    private handleMessage;
    private handleJoinRoom;
    private handleSendMessage;
    private handleStartRace;
    private handleProgressUpdate;
    private handleClose;
}
//# sourceMappingURL=chat.d.ts.map