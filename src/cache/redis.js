/**
 * @file This file contains functionality to set, get and remove key
 * value pairs from redis
 */
const { createClient } = require('redis');
const logs = require('../logger');

const debug = false;

const REDIS_PORT = Number(process.env.REDIS_PORT);
const redisClientConfig = {
  game: {
    host: process.env.GAME_REDIS_HOST,
    port: REDIS_PORT
  },
  product: {
    host: process.env.PRODUCT_REDIS_HOST,
    port: REDIS_PORT
  },
  deal: {
    host: process.env.DEAL_REDIS_HOST,
    port: REDIS_PORT
  },
  wallet: {
    host: process.env.WALLET_REDIS_HOST,
    port: REDIS_PORT
  },
  player: {
    host: process.env.GAMEPLAYER_REDIS_HOST,
    port: REDIS_PORT
  },
  common: {
    host: process.env.REDIS_HOST,
    port: REDIS_PORT
  },
  user: {
    host: process.env.USER_REDIS_HOST,
    port: REDIS_PORT
  },
  reader: {
    host: process.env.REDIS_READER_HOST,
    port: REDIS_PORT
  }
};

const redisClientSchema = {
  isConnected: false
};
const redisClients = {
  client: redisClientSchema,
  user: redisClientSchema,
  game: redisClientSchema,
  wallet: redisClientSchema,
  player: redisClientSchema,
  product: redisClientSchema,
  deal: redisClientSchema,
  common: redisClientSchema
};

/**
 *
 * @param {string} type - redis types
 * @returns redisClient either read-only or combined
 */
async function createRedisClientByType(type, isReader) {
  return new Promise((resolve, reject) => {
    const redisType = isReader ? 'reader' : type;
    const redisConnectionString =
      `redis://${redisClientConfig[redisType].host}:` +
      `${redisClientConfig[redisType].port}`;
    logs(`Connecting to Redis at ${redisConnectionString}`);
    const client = createClient({
      url: redisConnectionString
    });
    client.on('error', (err) => {
      const errMsg = `Redis client connection error: ${err.stack || err}`;
      process.env.DEBUG_REDIS === 'true' &&
        logs('error', 'createRedisClientByType', errMsg);
      reject(new Error(errMsg));
    });
    client.connect().then(() => {
      logs(`Redis debug mode ${debug}`);
      if (debug) {
        logs(
          `NEW REDIS CONNECTION FOR ${type} IS CREATED`,
          'debug',
          'createRedisClientByType'
        );
      }
      resolve(client);
    });
  });
}

const getRedisClientByType = async (type = 'common', isReader = false) => {
  logs(
    `Looking for redis client of type ${type}`,
    'debug',
    'getRedisClientByType'
  );
  const result = redisClients[type];
  if (result.isConnected) {
    return result;
  }
  redisClients[type] = await createRedisClientByType(type, isReader);
  redisClients[type].isConnected = true;
  return redisClients[type];
};

const disconnectClients = async () => {
  Object.values(redisClients).forEach((r) => {
    if (r.isConnected) {
      r.quit();
    }
  });
};

/**
 *
 * @param {string} key redis key
 * @param {string} type redis client type
 * @returns data or null
 */
async function getRedisCachedKey(key, type) {
  const client = await getRedisClientByType(type, true);
  const data = await client.get(key);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }
  return null;
}

/**
 *
 * @param {string} key cache key
 * @param {object or string} value data to save in cache
 * @param {string} type redis type
 */
async function setRedisCache(key, value, type, expiryInSeconds) {
  const client = await getRedisClientByType(type, false);
  await client.setEx(
    key,
    expiryInSeconds,
    typeof value === 'object' ? JSON.stringify(value) : value
  );
}

module.exports = {
  setRedisCache,
  getRedisCachedKey,
  getRedisClientByType,
  disconnectClients
};
