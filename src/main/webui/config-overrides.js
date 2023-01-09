// utilities
const { override } = require('customize-cra');
const glob = require('glob-all');
const paths = require("react-scripts/config/paths");
const path = require('path');

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
    devServer: function(configFunction) {
        // Return the replacement function for create-react-app to use to generate the Webpack
        // Development Server config. "configFunction" is the function that would normally have
        // been used to generate the Webpack Development server config - you can use it to create
        // a starting configuration to then modify instead of having to create a config from scratch.
        return function(proxy, allowedHost) {
            // Create the default config by calling configFunction with the proxy/allowedHost parameters
            const config = configFunction(proxy, allowedHost);
            config.historyApiFallback = false;

            // Return your customised Webpack Development Server config.
            return config;
        };
    }
};
