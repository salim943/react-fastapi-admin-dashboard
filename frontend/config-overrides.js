module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: false, // Disable 'crypto' module
  };
  return config;
};
