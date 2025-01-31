"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisManager = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const URL = process.env.REDIS_URL || "redis://localhost:6379";
class RedisManager {
    publisher;
    subscriber;
    constructor() {
        this.publisher = new ioredis_1.default(URL);
        this.subscriber = new ioredis_1.default(URL);
    }
    async subscribe(channel) {
        try {
            await this.subscriber.subscribe(channel);
        }
        catch (error) {
            console.error(`Error subscribing to channel ${channel}:`, error);
        }
    }
    async unsubscribe(channel) {
        try {
            await this.subscriber.unsubscribe(channel);
        }
        catch (error) {
            console.error(`Error unsubscribing from channel ${channel}:`, error);
        }
    }
    publish(channel, message) {
        try {
            this.publisher.publish(channel, JSON.stringify(message));
        }
        catch (error) {
            console.error(`Error publishing to channel ${channel}:`, error);
        }
    }
    cleanup() {
        this.publisher.disconnect();
        this.subscriber.disconnect();
    }
}
exports.RedisManager = RedisManager;
