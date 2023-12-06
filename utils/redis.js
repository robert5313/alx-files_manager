const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
    constructor() {
        this.client = redis.createClient({});

        // Promisify all relevant methods
        this.getAsync = promisify(this.client.get).bind(this.client);
        this.setexAsync = promisify(this.client.setex).bind(this.client);
        this.delAsync = promisify(this.client.del).bind(this.client);

        // Handle client errors
        this.client.on('error', (error) => {
            console.error('Redis client error:', error);
            rejects(error)
        });
    }

    async connect() {
        return new Promise((resolve) => {
            this.client.on('connect', () => {
                resolve(true);
            });

            this.client.on('error', () => {
                resolve(false);
            });
        });
    }

    async isAlive() {
        return this.client.connected;
    }

    async get(key) {
        return this.getAsync(key);
    }

    async set(key, value, duration) {
        return this.setexAsync(key, duration, value);
    }

    async del(key) {
        return this.delAsync(key);
    }
}

const redisClient = new RedisClient();

module.exports = redisClient;
