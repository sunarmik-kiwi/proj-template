const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const { addHttpRequest } = require('../../dao');
const { logs } = require('../../logger');

export function addWalletItemFallback(params, activeUser) {
  /*
    we will simply save the request in db and will process later.
    */
  return new Promise((resolve, reject) => {
    try {
      const requestId = uuidv4();
      const itemId = mongoose.Types.ObjectId();
      addHttpRequest({
        serviceName: 'nft-purchase',
        input: JSON.stringify({
          params
        }),
        authUserId: activeUser._id,
        requestStatus: 'pending',
        itemId,
        error: '',
        ip: '',
        requestId
      })
        .then(() => {
          logs(
            `Request saved. ${itemId}`,
            'error',
            'handleFallbackOfNFTPurchase'
          );
          resolve(itemId);
        })
        .catch((err) => {
          logs(err, 'error', 'handleFallbackOfNFTPurchase');
          reject(err);
        });
    } catch (error) {
      logs(`Promise failed. ${error}`, 'error', 'handleFallbackOfNFTPurchase');
      reject(error);
    }
  });
}
