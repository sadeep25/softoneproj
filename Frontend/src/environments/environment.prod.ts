export const environment = {
  production: true,
  apiUrl: '',  // Empty string uses relative URLs, proxied by nginx to backend
  features: {
    enableAnalytics: true,
    enableErrorReporting: true,
    enableDebugMode: false
  },
  httpTimeoutMs: 30000,
  retryAttempts: 3
};