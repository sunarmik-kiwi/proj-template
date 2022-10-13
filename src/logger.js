const path = require('path');
const pino = require('pino').default;
const logRotator = require('file-stream-rotator');
const { stringifier } = require('./stringifier');

const { PINO_LOG_LEVEL, ENABLE_LOGGING, MAX_LOGS } = process.env;

const enableLogger = ENABLE_LOGGING === 'true';
const maxFile = parseInt(MAX_LOGS, 10);

const levels = {
  debug: 30,
  crit: 60,
  error: 50,
  warn: 40,
  info: 20,
};
const filename = path.resolve('./logs/app-info');
const rotatingLogStream = logRotator.getStream({
  filename,
  frequency: 'daily',
  extension: '.log',
  max_logs: maxFile
});
const streams = Object.keys(levels).map((level) => ({
  level,
  stream: rotatingLogStream,
}));
streams.push({ stream: process.stdout, level: 'info' })

const logger = pino(
  {
    level: PINO_LOG_LEVEL || 'info',
    customLevels: levels,
    useOnlyCustomLevels: true,
    formatters: {
      level: (label) => ({ level: label }),
    },
    enabled: enableLogger,
  },
  pino.multistream(streams, { levels, dedupe: true }),
);

const logs = (message, level = 'info', methodName = '', schemaName = null) => {
  const msg = stringifier(schemaName, message);
  logger[level](`${msg} ${methodName ? `- From ${methodName}` : ''}`);
};
module.exports = logs;
