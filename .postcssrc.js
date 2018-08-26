const autoprefixer = require('autoprefixer');
const px2rem = require('postcss-px2rem');
// const sprites = require('@meitu/postcss-sprites');

module.exports = {
  plugins: [
    // sprites({
    //   spritePath: './src/assets/images/',
    //   // basePath: './src/main.js',
    //   filterBy(image) {
    //     // 忽略文件路径中含有 `skip`, `jpg` 的图片
    //     // 下面规则表示 `.jpg` 格式的图片和文件名中含有 `skip` 的图片将不会被合并到雪碧图中
    //     if (/\.(svg|gif|jpg)$/.test(image.url) || /skip/.test(image.url)) return Promise.reject();
    //     return Promise.resolve();
    //   },
    //   groupBy(image) {
    //     // 图片名称中含有 `groupName` 文字的图片将会生成单独的 `sprite.groupName.png` 的雪碧图
    //     // 若合成的雪碧图太大，可以以这种方式分组
    //     if (image.url.indexOf('groupName') !== -1) return Promise.resolve('groupName');
    //     return Promise.reject(new Error('Not a file image.'));
    //   },
    //   spritesmith: {
    //     padding: 50,
    //   },
    // }),
    autoprefixer(),
    px2rem({
      remUnit: 46.875,
    }),
  ],
};
