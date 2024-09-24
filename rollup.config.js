const path = require('path')
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve');
const babel = require('@rollup/plugin-babel')


module.exports = {
    input: {
        main: path.resolve(__dirname, './src/main.js'),
        sconed: path.resolve(__dirname, './src/sconed.js'),
        three: path.resolve(__dirname, './src/three.js'),
        four: path.resolve(__dirname, './src/four.js'),
        five: path.resolve(__dirname, './src/five.js'),
        six: path.resolve(__dirname, './src/six.js'),
    },
    output: {
        dir: "build/",
        // format: "esm"
    },
    plugins: [
        commonjs(),
        resolve(),
        babel({
            babelrc: false,
            babelHelpers: "runtime",
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: {
                            browsers: '> 0.5%, ie >= 11',
                        },
                        // entry | usage | false
                        useBuiltIns: false,
                        // corejs: 3,
                    },
                ],
            ],
            plugins: [
                [
                  '@babel/plugin-transform-runtime',
                  {
                    absoluteRuntime: false,
                    // polyfill使用的corejs版本
                    // 需要注意这里是@babel/runtime-corejs3 和 preset-env 中是不同的 npm 包
                    corejs: 3,
                    // 简单点来说 useESModules: true 表示注入的 helpers 模块为 ESM 导出，而设置为 false 时表示使用 CJS 导出。
                    useESModules: true,
                    // 切换对于 @babel/runtime 造成重复的 _extend() 之类的工具函数提取
                    // 默认为true 表示将这些工具函数抽离成为工具包引入而不必在每个模块中单独定义
                    helpers: true,
                    // 切换生成器函数是否污染全局 
                    // 为true时打包体积会稍微有些大 但生成器函数并不会污染全局作用域
                    regenerator: true,
                    // version: '7.0.0-beta.0',
                  },
                ]
            ]
        })
    ]
}