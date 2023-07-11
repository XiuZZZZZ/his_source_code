//pengjunfu 
//修改生成的html引用的文件路径
var path = require('path')
function ChunksChangePlugin(options) {

}

ChunksChangePlugin.prototype.apply = function (compiler) {
    compiler.plugin('compilation', function (compilation) {
        compilation.plugin('html-webpack-plugin-before-html-generation', function (data, cb) {
            // data.assets.js = data.assets.js.map(function (assetsPath) {
            //     return path.posix.join("../scripts/nurse/dist/dist/", assetsPath)
            // })
            // data.assets.css = data.assets.css.map(function (assetsPath) {
            //     return path.posix.join("../scripts/nurse/dist/dist/", assetsPath)
            // })
            cb();
        });
    });
};

module.exports = ChunksChangePlugin;