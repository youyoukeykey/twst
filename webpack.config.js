const path = require('path');
var pathToPhaser = path.join(__dirname, "/node_modules/phaser/");
var phaser = path.join(pathToPhaser, "dist/phaser.js");
var webpack = require('webpack');
module.exports = {
    // モードの設定
    mode: 'development',
    // エントリーポイントの設定
    entry: `./src/main.ts`,
    // ファイルの出力設定
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    },
     devServer: {
        contentBase: "dist",
        open: true
    },
    module: {
        rules: [
            {
                // 拡張子 .ts の場合
                test: /\.ts$/,
                // TypeScript をコンパイルする
                use: 'ts-loader',
            },
        ],
    },
    // import 文で .ts ファイルを解決するため
    // これを定義しないと import 文で拡張子を書く必要が生まれる。
    // フロントエンドの開発では拡張子を省略することが多いので、
    // 記載したほうがトラブルに巻き込まれにくい。
    resolve: {
        // 拡張子を配列で指定
        extensions: [
            '.ts', '.js',
        ],
    },
};
