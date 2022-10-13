const {
  CACHE_TYPES
} = require('./cacheTypes');

/**
 * @file This file contains list of errors in cache
 */
const CACHE_ERRORS = {
  invalidCacheType: {
    message: `Invalid cache type used. Supported cache types are: ${Object.keys(
      CACHE_TYPES
    )}}`
  }
};

module.exports = {
  CACHE_ERRORS
}
