const appErrors = require('../errors');
const logs = require('../logger');

function checkAllRequiredEnvs(envsList) {
  try {
    envsList.forEach((envKeyObj) => {
      const key = Object.keys(envKeyObj)[0];
      if (!envKeyObj[key]) {
        throw new Error(appErrors[key].message);
      }
    });
  } catch (err) {
    logs(err.stack || err, 'error', 'checkAllRequiredEnvs');
    process.exit(1);
  }
}

const {
  PORT,
  MONGODB_URI,
  PINO_LOG_LEVEL,
  ENABLE_LOGGING,
  MAX_LOGS,
  EXEC_ENV,
  USE_LOCAL_CACHE,
  SUPPORTING_BLOCKCHAINS,
  IS_TESTING,
  TEST_DB_URL,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  REGION,
  IS_TESTNET,
  TESTNET_AWS_ACCESS_KEY_ID,
  TESTNET_AWS_SECRET_ACCESS_KEY,
  TESTNET_REGION,
  WALLET_EXPIRYINSECONDS
} = process.env;
checkAllRequiredEnvs([
  {
    PORT
  },
  {
    MONGODB_URI
  },
  {
    PINO_LOG_LEVEL
  },
  {
    ENABLE_LOGGING
  },
  {
    MAX_LOGS
  },
  {
    EXEC_ENV
  },
  {
    USE_LOCAL_CACHE
  },
  {
    REGION
  },
  {
    AWS_ACCESS_KEY_ID
  },
  {
    AWS_SECRET_ACCESS_KEY
  },
  {
    WALLET_EXPIRYINSECONDS
  }
]);

// common checks
if (EXEC_ENV === 'prodv2' && IS_TESTNET === 'true') {
  throw new Error(
    `NFT service in production environment must use mainnet configuration.
     Please change env IS_TESTNET to false.`,
  );
}
const isTestNet = EXEC_ENV !== 'prodv2' || IS_TESTNET === 'true';

const awsConfig = {
  accessKeyId: isTestNet ? TESTNET_AWS_ACCESS_KEY_ID : AWS_ACCESS_KEY_ID,
  secretAccessKey: isTestNet
    ? TESTNET_AWS_SECRET_ACCESS_KEY
    : AWS_SECRET_ACCESS_KEY,
  region: isTestNet ? TESTNET_REGION : REGION,
};
const SUPPORTING_BLOCKCHAINS_ARRAY = SUPPORTING_BLOCKCHAINS
  ? SUPPORTING_BLOCKCHAINS.split(',')
  : ['palm'];
const BLOCKCHAINS = {};
SUPPORTING_BLOCKCHAINS_ARRAY.forEach((blockchainName) => {
  BLOCKCHAINS[blockchainName.toUpperCase()] = blockchainName;
});
if (USE_LOCAL_CACHE !== 'true') {
  logs('LOCAL cache is disabled.', 'info', 'checkAllRequiredEnvs');
}
const walletExpiryInSeconds = Number(WALLET_EXPIRYINSECONDS);

module.exports = {
  PORT,
  DB_URL:
    IS_TESTING === 'true' && TEST_DB_URL && EXEC_ENV === 'dev'
      ? TEST_DB_URL
      : MONGODB_URI,
  EXEC_ENV,
  STABLE_API_VERSION: '/api/v2',
  LEGACY_API_VERSION: '/api/v1',
  SUPPORTING_BLOCKCHAINS: SUPPORTING_BLOCKCHAINS_ARRAY,
  BLOCKCHAINS,
  DEFAULT_LOCATION: 'global',
  USE_LOCAL_CACHE: USE_LOCAL_CACHE === 'true',
  REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  awsConfig,
  walletExpiryInSeconds,
};
