const mongoose = require('mongoose').default;

const logs = require('../logger');

async function connectWithDatabase(dbUrl, options = {}, isInDebugMode = false) {
  try {
    logs(`Connecting to db at ${dbUrl}`, 'info', 'connectWithDatabase');
    await mongoose.connect(dbUrl, {
      ...options,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    if (isInDebugMode) {
      mongoose.set('debug', true);
    }
  } catch (err) {
    logs(err.stack || err, 'error', 'connectWithDatabase');
    throw err;
  }
}
function databaseStatus() {
  return {
    state: mongoose.STATES[mongoose.connection.readyState]
  };
}

function disconnectDBConnection() {
  return mongoose.disconnect();
}

module.exports = {
  connectWithDatabase,
  databaseStatus,
  disconnectDBConnection
}
