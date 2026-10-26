function readableRpcError(error) {
  const message = (error && (error.shortMessage || error.message)) || 'Campaign data could not be loaded.';
  if (/ECONNREFUSED|ENOTFOUND|ETIMEDOUT|Failed to fetch|NetworkError|network/i.test(message)) {
    return 'Campaign data could not be loaded from the read-only network. Check NETWORK_ENDPOINT.';
  }
  return message;
}

module.exports = { readableRpcError };
