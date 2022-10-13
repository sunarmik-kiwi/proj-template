const CircuitBreaker = require('opossum');
const { addWalletItemCBOptions } = require('./addWalletCBOptions');
const { addWalletItemService } = require('../../services/addWalletItem');
const { logs } = require('../../logger');
const { addWalletItemFallback } = require('./addWalletItemFallback');
const { CustomError } = require('../../utils/customError');
const { apiErrors } = require('../../errors');

const { addWalletItemQueue, serverBusy } = apiErrors;

const addWalletItemServiceCB = new CircuitBreaker(
  addWalletItemService,
  addWalletItemCBOptions
);

addWalletItemServiceCB.fallback(async (params, user) => {
  try {
    logs(
      `Saving the request. \n PARAMS: ${JSON.stringify(params)}, \nUSERID: ${
        user._id
      }`,
      'error',
      'addWalletItemServiceCB'
    );
    await addWalletItemFallback(params, user);
    throw new CustomError(addWalletItemQueue, false, true);
  } catch (err) {
    if (err instanceof CustomError) {
      throw err;
    }
    logs(
      `Failed to save the request. ${err.stack || err}`,
      'error',
      'fallback'
    );
    throw new CustomError(serverBusy);
  }
});

module.exports = addWalletItemServiceCB;
