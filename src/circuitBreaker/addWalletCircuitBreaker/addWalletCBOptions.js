const addWalletItemCBOptions = {
  timeout: 10000, // api forced timeout
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 2000 // After 10 seconds, try again.
};
module.exports = {
  addWalletItemCBOptions
};
