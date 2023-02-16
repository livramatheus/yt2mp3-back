import { createClient, RedisClientType as _RedisClientType } from "redis";

class RedisManager {

    static client: _RedisClientType;
    
    private constructor() {}

    static async getInstance(): Promise<_RedisClientType> {
        if (!this.client) {
            this.client = createClient({
                url: process.env.REDIS_SERVER_URL
            });
            
            this.client.on('error', err => console.log('Redis Client Error', err));
            await this.client.connect();
        }
        
        return this.client;
    }

    static async init(): Promise<void> {
        await this.getInstance();
    }
}

export { RedisManager };