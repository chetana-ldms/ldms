const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/socket.io",
    createProxyMiddleware({
      target: "http://115.110.192.133:4000",
      ws: true,
      changeOrigin: true,
    })
  );
};
