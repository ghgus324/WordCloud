//webpack 사용 방법 명시
'use strict'
const path = require('path'); //path라는 라이브러리 불러옴

module.exports = {
    //entry ponint
    entry: {
        main: ['./src/main.js']
    },
    output: {
        path: path.resolve(__dirname, './build'),
        filename: '[name].js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            include: path.resolve(__dirname, './src'),  //모든 코드는 src안에 나둠         
            loaders: 'babel-loader'
        }]
    },
    plugins:[],
    devServer: {
        contentBase: './public', //기본적으로 사용자가 보게 되는 문서 위치
        host: 'localhost' ,
        port: 8070
    }
}
