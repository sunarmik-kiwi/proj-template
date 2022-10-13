/**
 * @file This file contains functionality to get, set and remove key
 * value pairs from process level cache.
 */

const NC = require('node-cache');
const logs = require('../logger');

let cache = null;
if (!cache) {
  logs(`Recreating local cache for process id ${process.pid}`);
  cache = new NC({
    stdTTL: 3600,
    useClones: false
  });
}

function getLocalCachedKey(key) {
  return cache.get(key);
}

function setLocalCache(key, value) {
  return cache.set(key, value);
}

module.exports = {
  getLocalCachedKey,
  setLocalCache
};
