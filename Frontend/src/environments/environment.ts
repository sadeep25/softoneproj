export const environment = {
  production: false,
  apiUrl: '',  // Empty string uses relative URLs, proxied by nginx to backend
  features: {
    enableAnalytics: false,
    enableErrorReporting: true,
    enableDebugMode: true
  },
  httpTimeoutMs: 30000,
  retryAttempts: 3
};