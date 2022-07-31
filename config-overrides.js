// utilities
const { override } = require('customize-cra');
const glob = require('glob-all');
const paths = require("react-scripts/config/paths");
const path = require('path');

// paths
paths.appSrc = path.resolve(__dirname, 'src/main/webapp/app');
paths.appIndexJs = path.resolve(__dirname, 'src/main/webapp/app/index.tsx');
paths.appPublic = path.resolve(__dirname, 'src/main/webapp/public');
paths.appHtml = path.resolve(__dirname, 'src/main/webapp/public/index.html');

// plugins
const CspHtmlWebpackPlugin = require("@melloware/csp-webpack-plugin");
const PurgecssPlugin = require('purgecss-webpack-plugin');

// Content Security Policy
const cspConfigPolicy = {
    'default-src': "'none'",
    'base-uri': "'self'",
    'connect-src': "'self'",
    'worker-src': "'self' blob:",
    'img-src': "'self' blob: data: content:",
    'font-src': "'self'",
    'frame-src': "'self'",
    'manifest-src': "'self'",
    'object-src': "'none'",
    'style-src': ["'self'"],
    'script-src': ["'strict-dynamic'"],
    'require-trusted-types-for': ["'script'"]
};

// Enable CSP and SRI. See https://github.com/melloware/csp-webpack-plugin
const cspPlugin = new CspHtmlWebpackPlugin(cspConfigPolicy);

// Remove unused CSS with PurgeCSS. See https://github.com/FullHuman/purgecss
const purgeCssPlugin = new PurgecssPlugin({
    paths: [paths.appHtml, ...glob.sync(`${paths.appSrc}/**/*`, { nodir: true })],
    safelist: {
      standard: [],
      deep: [],
      greedy: [/p-/,/pi-/, /col-/, /layout/]
    } 
});

// add all plugins to Webpack pipeline in correct order
function addPlugins(config, env) {
    if (env === 'production') {
        config.plugins.push(purgeCssPlugin);
        config.plugins.push(cspPlugin);
        config.output.crossOriginLoading = "anonymous";
    }
    return config;
}

module.exports = {
    webpack: override(addPlugins),
};