// vue.config.js

module.exports = {
    publicPath: '/RezepteApp/',
    devServer: {
        historyApiFallback: {
            index: '/RezepteApp/' // Hier den gewünschten Basispfad angeben
        }
    }
};
