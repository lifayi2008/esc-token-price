const Redis = require("ioredis");
const config = require("./config");

const redis = new Redis(config.redisPort, config.redisHost, {connectTimeout: 1000, maxRetriesPerRequest: 1});

module.exports = {

    get: async function(key) {
        return await redis.get(key);
    },

    set: async function(key, value) {
        return await redis.set(key, value);
    },

    clearCache: async function() {
        return await redis.flushall();
    },

    clearKey: async function(key) {
        return await redis.del(key);
    },

    commands: async function() {
        return await redis.getBuiltinCommands();
    }
}
