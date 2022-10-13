/**
 * @file This file exposes a common interface for all cache types.
 * It leaves the cache types extendable.
 */
const typesOfCache = require('./cacheTypes');
const {
  getRedisCachedKey,
  setRedisCache,
  getRedisClientByType,
  disconnectClients
} = require('./redis');
const { getLocalCachedKey, setLocalCache } = require('./local');
const { CACHE_ERRORS } = require('./cache-errors');

const { CACHE_TYPES } = typesOfCache;

function initCache(redisType, isReader) {
  return getRedisClientByType(redisType, isReader);
}

/**
 * @description this is a common getter for all cache types
 * @param {function} logs logger function
 * @returns Promise or error or data
 */
function getKeyValue(key, cacheToUse, redisType = 'common') {
  switch (cacheToUse) {
    case CACHE_TYPES.local:
      return getLocalCachedKey(key);
    case CACHE_TYPES.redis:
      return getRedisCachedKey(key, redisType);
    default:
      throw new Error(CACHE_ERRORS.invalidCacheType);
  }
}

/**
 * @description this is a common setter for all cache types
 * @param {function} logs logger function
 * @returns Promise or error or data
 */
function setKeyValue(
  key,
  value,
  cacheToUse,
  redisType = 'common',
  expiryInSeconds = 3600
) {
  switch (cacheToUse) {
    case CACHE_TYPES.local:
      return setLocalCache(key, value);
    case CACHE_TYPES.redis:
      return setRedisCache(key, value, redisType, expiryInSeconds);
    default:
      throw new Error(CACHE_ERRORS.invalidCacheType);
  }
}

module.exports = {
  initCache,
  disconnectClients,
  getKeyValue,
  setKeyValue,
  ...typesOfCache,
  CACHE_ERRORS
};
