import Redis from "ioredis";
export declare class RedisManager {
    private publisher;
    subscriber: Redis;
    constructor();
    subscribe(channel: string): Promise<void>;
    unsubscribe(channel: string): Promise<void>;
    publish(channel: string, message: any): void;
    cleanup(): void;
}
//# sourceMappingURL=redis.d.ts.map