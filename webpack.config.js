//该配置文件就是一个js文件，通过Node中的模块操作，向外暴露了一个配置对象
const path = require('path')
//启用热更新的第二步
const webpack = require('webpack')
//导入在内存中生成html页面的插件（html-webpack-plugin）
//只要是插件一定要放到plugins节点中去
//该插件的两个作用：
//1、自动在内存中根据指定页面生成了一个内存的页面
//2、自动把打包好的bundle.js文件引入到页面中去
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry : path.join(__dirname, './src/main.js'),//入口，表示要使用webpack打包哪个文件
    output : {//输出文件的相关配置
        path : path.join(__dirname, './dist'),//指定打包好的文件输出到哪个目录中去
        filename : 'bundle.js'
    },
    devServer : {//这是配置dev-server命令参数的第二种形式，相对复杂
        open : true,//自动打开浏览器
        port : 3000,//设置启动时候的端口
        contentBase : 'src',//指定托管的根目录
        hot : true //启用热更新，这是第一步
    },
    plugins : [//配置插件的节点
        new webpack.HotModuleReplacementPlugin(),//new 一个热更新的模块对象，这是启用热更新的第三步
        new htmlWebpackPlugin({//创建一个在内存中生成html页面的插件
            //指定模板页面，后面后根据指定的页面路径去生成内存中的页面
            template : path.join(__dirname, './src/index.html'),
            filename : 'index.html',//指定生成页面的名称
        })
    ],
    module : {//这个节点用于配置所有第三方模块加载器
        rules : [//所有第三方模块的匹配规则
            { test : /\.css$/, use : ['style-loader', 'css-loader'] },//配置处理css文件的第三方loader
            { test : /\.less$/, use : ['style-loader', 'css-loader', 'less-loader'] },
            { test : /\.scss$/, use : ['style-loader', 'css-loader', 'sass-loader'] },
            { test : /\.(jpg|png|gif|jpeg)$/, use : 'url-loader?limit=10,385&name=[hash:4]-[name].[ext]' },
            { test : /\.(svg|ttf|eot|woff|woff2)$/, use : 'url-loader' },
            //只转换自己写的js文件，通过exclude排除node_modules包中js文件，1、减少打包时间；2、否则项目无法运行
            { test : /\.js$/, use : 'babel-loader', exclude : /node_modules/ },
        ]
    }
}
//1、使用webpack-dev-server这个工具，来实现自动打包编译的功能
//2、运行npm i webpack-dev-server -D 把这个工具安装到项目的本地开发依赖
//3、安装完成后，这个工具的用法和webpack命令完全一样
//4、由于是在项目中，本地安装的webpack-dev-server，所以无法把它当做脚本命令，在owershell终端中直接运行
//5、注意：webpack-dev-server这个工具，如果想要正常运行，必须在本地项目中安装webpack
//6、webpack-dev-server帮我们打包生成的bundle.js文件并没有存放到实际的物理磁盘上，
//而是直接托管到电脑内存中，所以无法在项目的根目录中找到这个打包好的bundle.js