import Redis from 'ioredis';

// Create a Redis client
const redis = new Redis(); // Default: localhost:6379

export default redis;