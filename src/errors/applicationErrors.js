const { StatusCodes } = require('../constants');

module.exports = {
  PORT: {
    message: 'PORT is missing in the env file.',
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  },
  MONGODB_URI: {
    message: 'MONGODB_URI is missing in the env file.',
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  },
  PINO_LOG_LEVEL: {
    message: 'PINO_LOG_LEVEL is missing in the env file.',
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  },
  ENABLE_LOGGING: {
    message: `Logging should be either enabled or disabled. 
      ENABLE_LOGGING is missing in the env file.`,
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  },
  MAX_LOGS: {
    message: 'MAX_LOGS is missing in the env file.',
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  },
  EXEC_ENV: {
    message: 'EXEC_ENV is missing in the env file.',
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  },
  REGION: {
    message: 'REGION is missing in the env file.',
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  },
  AWS_ACCESS_KEY_ID: {
    message: 'AWS_ACCESS_KEY_ID is missing in the env file.',
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  },
  AWS_SECRET_ACCESS_KEY: {
    message: 'AWS_SECRET_ACCESS_KEY is missing in the env file.',
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  },
  WALLET_EXPIRYINSECONDS: {
    message: 'WALLET_EXPIRYINSECONDS is missing in the env file.',
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  },
};
