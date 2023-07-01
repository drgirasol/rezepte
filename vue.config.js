// vue.config.js

module.exports = {
    publicPath: '/',
    devServer: {
        historyApiFallback: {
            index: '/'
        },
        proxy: {
            '/api': {
                target: 'http://localhost:3000', // Beispiel-Backend-URL
                changeOrigin: true
            }
        }
    }
};
