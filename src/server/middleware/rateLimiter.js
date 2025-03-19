const { RateLimiterRedis } = require('rate-limiter-flexible');
const redis = require('redis');

const client = redis.createClient({ url: process.env.REDIS_URL });
const limiter = new RateLimiterRedis({
  storeClient: client,
  points: 10,
  duration: 60,
  blockDuration: 300
});

async function rateLimit(req, res, next) {
  try {
    await limiter.consume(req.ip);
    next();
  } catch (error) {
    res.status(429).json({ error: 'Too many requests' });
  }
}

module.exports = { rateLimit };
