/**
 * @file This file provides clustering feature
 * for load balancing, high availability and scalability.
 */
const cluster = require('node:cluster');
const { cpus } = require('node:os');
const { initApp, logs } = require('./src/app')

const TOTAL_CPUs = cpus().length;

logs('Initiating Cluster Mode', 'info', 'server');

async function init() {
  if (cluster.isPrimary) {
    logs(
      `Master Process ${process.pid} is running.`,
      'info',
      'server-primary process'
    );
    for (let i = 0; i < TOTAL_CPUs; i++) {
      cluster.fork();
    }
    cluster.on('exit', async (worker, code, signal) => {
      const data = `worker ${worker.process.pid} died 
           - code: ${code}, signal: ${signal}`;
      logs(data, 'info', '[main]');
      logs("Let's fork another worker!", 'info', '[main]',);
      cluster.fork();
      // await triggerMail(data, 'Thread Kill Notification')
    });
  } else {
    logs('Starting app as worker')
    initApp()
  }
}

init().catch((err) => {
  logs(
    `Init cluster failed, ${err.stack || err}`,
    'error',
    'server-init'
  );
});
