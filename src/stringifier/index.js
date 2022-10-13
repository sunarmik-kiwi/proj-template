const fastJson = require('fast-json-stringify');

function stringifier(schema, objToStringify, fastJsonOptions) {
  if (typeof objToStringify === 'string') {
    return objToStringify;
  }
  if (schema && !fastJsonOptions) {
    return fastJson(schema)(objToStringify);
  }
  if (schema && fastJsonOptions) {
    return fastJson(schema, fastJsonOptions)(objToStringify);
  }
  return JSON.stringify(objToStringify);
}

module.exports = {
  stringifier,
  ...require('./stringifierSchemas')
};
