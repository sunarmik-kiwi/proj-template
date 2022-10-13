require('newrelic');
require('dotenv').config({});
const helmet = require('helmet');
const closeWithGrace = require('close-with-grace');
const cors = require('cors');
const express = require('express');
const { PORT, DB_URL, STABLE_API_VERSION } = require('./config');
const logs = require('./logger');
// const { addWalletCiruitBreaker } = require('./circuitBreaker');
const { initCache, disconnectClients } = require('./cache');
const { connectWithDatabase, disconnectDBConnection } = require('./database');
const { healCheckResponseSchema, stringifier } = require('./stringifier');

function initApp() {
  const app = express();

  app.set('port', PORT);
  app.disable('etag').disable('x-powered-by');
  app.use(helmet());
  app.use((_, res, next) => {
    res.header('Cache-Control', 'no-store');
    res.header('Pragma', 'no-cache');
    next();
  });
  app.use(express.json());
  app.use(cors()); // later whiteListIp or origin

  async function closeServerResources() {
  // close redis connection
    try {
      await disconnectClients();
    } catch (err) {
      logs(err.stack || err, 'crit', 'main-redis');
    }
    // close db connection
    try {
      await disconnectDBConnection()
    } catch (err) {
      logs(err.stack || err, 'crit', 'main-db')
    }
  }

  // circuitBreakers
  // app.addWalletCiruitBreaker = addWalletCiruitBreaker;

  // init cache
  initCache()
    .then(() => {
      logs('Redis connection succeessful.');
    })
    .catch((err) => {
      logs(
        `Failed to connect to redis server due to ${err.stack || err}`,
        'error',
        'main'
      );
    // todo: send mail
    });

  connectWithDatabase(DB_URL)
    .then(() => {
      logs('Database connected', 'info', 'main');

      // health-check
      app.get(`${STABLE_API_VERSION}/nft/health-check`, (_, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(stringifier(healCheckResponseSchema, { message: 'working' }));
      });

      // 404
      app.use((_, res) => {
        const error = new Error(
          'Route not found. Please check API documentation of GEER.'
        );
        error.status = 404;
        res.status(error.status || 500).send({
          error: {
            status: error.status || 500,
            message: error.message || 'Internal Server Error'
          }
        });
      });

      app.listen(PORT, () => {
        logs(
          `NFT is listening on port: ${PORT} and process id is ${process.pid}`,
          'info',
          'main'
        );
      });
      closeWithGrace({ delay: 500 }, async ({ signal, err, manual }) => {
        if (err) {
          logs(
            `${err.stack || err}
      signal: ${signal}
      manual: ${manual}`,
            'crit',
            'main'
          );
        }
        await closeServerResources();
        logs(
          'All resources are removed. Shutting down now...',
          'info',
          'main-shutdown'
        );
      });
    })
    .catch((err) => {
      logs(err.stack || err, 'crit', 'main-db');
      process.exit(1);
    });
  return app
}
if (process.env.NODE_ENV === 'development') {
  initApp()
}

module.exports = {
  initApp,
  logs
}
