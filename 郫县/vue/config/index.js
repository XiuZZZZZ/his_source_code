// see http://vuejs-templates.github.io/webpack for documentation.
var path = require("path");

module.exports = {
  build: {
    outputFileName: {
      mainEntry: path.resolve(__dirname, "../dist/dhc.nurse.vue.mainEntry.csp")
    },
    env: require("./prod.env"),
    index: path.resolve(__dirname, "../dist/index.html"),
    assetsRoot: path.resolve(__dirname, "../nurse station"),
    assetsSubDirectory: "../scripts/nurse/nurse station/",
    assetsPublicPath: "",
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ["js", "css"],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    mainEntry: "mainEntry",
    env: require("./dev.env"),
    port: 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: "images",
    assetsPublicPath: "/",
    proxyTable: {
      // '/dthealth/web/csp/nurseserver': 'http://10.1.41.27'
      "/imedical/web/csp": "http://127.0.0.1"
      // "/dthealth/web/csp": "http://192.168.128.181"
      // "/dthealth/web/csp": "http://114.251.235.112"
      // "/dthealth/web/csp": "http://172.19.19.59"
      // "/dthealth/web/csp": "http://114.251.235.112"
      // "/imedical/web/csp": "http://172.16.10.20"
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
};
