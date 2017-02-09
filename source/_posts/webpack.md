---
title: 使用webpack构建项目
date: 2017-02-08 11:48:09
tags:
 - webpack
 - js
 - tool
---

此文基于[webpack2](https://webpack.js.org/)，做为个人稳定使用的一套webpack配置，记录下来，以供参考。
<small>*[查看源码](https://github.com/mlxiao93/webpack-demo)*</small>

<!-- more -->

## webpack概念
webpack是一个模块化打包工具，使用js作为载体将所有静态资源打包在一起，支持的loader和plugin等能对各种静态资源进行预处理，极大地方便了前端的工程化开发。详情参考[官网](https://webpack.js.org/)，此处放张官网概念图：

![webpack](http://o86lf0oxm.bkt.clouddn.com/webpack-concept.svg)

## 构建流程

### 环境要求
[nodejs](https://nodejs.org)  
<small>*tips: 装好nodejs后可以使用[淘宝NPM镜像](https://npm.taobao.org/)替代官方版本*
`npm install -g cnpm --registry=https://registry.npm.taobao.org`</small>

### 项目初始化
#### 创建项目
创建一个webpack-demo项目并生成package.json文件。*之后所有操作的根目录均为webpack-demo/*
``` bash
mkdir webpack-demo
cd webpack-demo
npm init -f
```
#### 引入webpack2
``` bash
cnpm i -D webpack@beta
```
  ![folder](http://o86lf0oxm.bkt.clouddn.com/webpack-demo-01.png)
#### 项目初始结构分析
  + 通常项目会分成三个运行环境：开发人员在本地跑的开发环境(dev)、测试人员用来做黑盒测试的测试环境(test)和线上运行的生产环境(production)。
    简单起见，本文只考虑开发环境(dev)和生产环境(prod)，测试环境可以自行类比。
  + 综上，webpack的配置需要有两套，同时两套配置必然会存在相同的部分，故新建目录与文件如下图：

    ![folder](http://o86lf0oxm.bkt.clouddn.com/webpack-demo-03.png)

    同时引入一个库[webpack-merge](https://github.com/survivejs/webpack-merge)用于合并base config和特定环境的config
    ``` bash
    cnpm i -D webpack-merge
    ```
#### 开始写webpack config
  <span class="filename">webpack-config/base.js<span>    
  ``` js
  module.exports = {
    //common config
  };
  ```
  <span class="filename">webpack-config/dev.js, webpack-config/prod.js<span>
  ``` js
  const webpackMerge = require('webpack-merge');
  const base = require('./base');

  module.exports = webpackMerge(base, {
    //specific config
  });
  ```
  <span class="filename">webpack.config.js<span>
  ``` js
  const devModule = require('./webpack-config/dev');
  const prodModule = require('./webpack-config/prod');

  let finalModule = {};

  let ENV = process.env.NODE_ENV;     //此处变量可由命令行传入

  switch (ENV) {
    case 'dev':
      finalModule = devModule;
      break;
    case 'prod':
      finalModule = prodModule;
      break;
    default:
      break;
  }

  module.exports = finalModule;
  ```
#### 编写[npm scripts](http://www.ruanyifeng.com/blog/2016/10/npm_scripts.html)，区分环境
  <span class="filename">package.json<span>
  ``` json
  {
    "name": "webpack-demo",
    "version": "1.0.0",
    "scripts": {
      "dev": "cross-env NODE_ENV=dev webpack",
      "prod": "cross-env NODE_env=prod webpack"
    },
    "devDependencies": {
      "webpack": "^2.2.0",
      "webpack-merge": "^2.6.1"
    }
  }
  ```
  由于*unix和windows设置NODE_ENV的语句有所[差异](http://stackoverflow.com/questions/9249830/how-can-i-set-node-env-production-in-windows)，此处用到了一个库[cross-env](https://github.com/kentcdodds/cross-env)以达到兼容的目的
  ``` bash
  cnpm i -D cross-env
  ```

### 从dev环境写起
新建一个src目录用户存放项目源文件，同时在src下新建一个index.js作为打包的入口

#### webpack-dev-server
+ 安装[webpack-dev-server](https://webpack.js.org/guides/development/#webpack-dev-server)
  ``` bash
  cnpm i -D webpack-dev-server
  ```
+ 配置webpack config
  <span class="filename">webpack-config/dev.js<span>
  ```
  ...
  module.exports = webpackMerge(base, {
    entry: process.cwd() + '/src/index.js',
    output: {
      filename: '[name].bundle.js'
    },
    devtool: 'eval-source-map'   //enable srouce map
  });
  ```
+ 修改npm scripts
  <span class="filename">package.json<span>
  ```
  {
   ...
   "scripts": {
     "dev": "cross-env NODE_ENV=dev webpack-dev-server --inline --hot --host 0.0.0.0",
     ...
   }
  }
  ```

#### htmlWebpackPlugins
src目录下新建一个index.html作为template，htmlWebpackPlugins会根据这个template生成网站的index.html，同时自动写入bundle依赖。
src下放一个favicon.ico作为网站的icon
+ 安装[htmlWebpackPlugins](https://webpack.js.org/plugins/html-webpack-plugin/)
  ``` bash
  cnpm i -D html-webpack-plugin
  ```
+ 配置webpack config
  <span class="filename">webpack-config/dev.js<span>
  ``` js
  ...
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  ...
  module.exports = webpackMerge(base, {
    ...
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: process.cwd() + '/src/index.html',
        favicon: process.cwd() + '/src/index.html'
      })
    ]
    ...
  });
  ```
到这一步算是完成了最基本的开发环境配置，命令行执行`npm run dev`，然后浏览器打开localhost:8080就能看到成果
将npm scripts中的[start命令](https://docs.npmjs.com/cli/start)指向npm run dev，这样每次开始开发只需要执行`npm start`
<span class="filename">package.json<span>
```
{
  ...
  "scripts": {
    ...
    "start": "npm run dev"
    ...
  }
  ...
}
```

#### Loaders(Rules)
webpack本身只能处理js模块，如果需要处理其他类型的文件，就需要[Loaders](https://webpack.js.org/concepts/loaders/)进行转换
##### ES6+支持
ES6+虽然不能直接被浏览器全部识别，但是能用babel转换成ES5代码。
+ 安装babel编译相关依赖
  ``` bash
  cnpm i -D babel-core babel-preset-latest babel-preset-stage-2 babel-runtime babel-plugin-transform-runtime babel-loader
  ```
+ 新建.babelrc文件并写入:
  <span class="filename">.babelrc<span>
  ```
  {
    "presets": ["latest", "stage-2"],
    "plugins": ["transform-runtime"]
  }
  ```
+ 配置rules
  <span class="filename">webpack-config/dev.js<span>
  ```
  module.exports = webpackMerge(base, {
    ...
    module: {
      rules: [
        ...
        {
          test: /\.js$/,
          exclude: [/node_modules/],
          loader: 'babel-loader'
        }
        ...
      ]
    }
    ...
  });
  ```

##### css处理
现如今css预处理器已经成为前端开发的标配，[Sass(Scss)](http://sass-lang.com/),[Less](http://lesscss.org/)和[Stylus](http://stylus-lang.com/)各行其道，个人偏好scss。
[PostCss](http://postcss.org/)可以作为一个后处理器，实现为css自动添加浏览器前缀等功能
+ 安装相关依赖
  ``` bash
  cnpm i -D style-loader css-loader postcss-loader autoprefixer node-sass sass-loader
  ```
+ 新建postcss.config.js
  <span class="filename">postcss.config.js<span>
  ``` js
  module.exports = {
    plugins: [
      require('autoprefixer')({browsers: ['last 2 versions', 'iOS 7', 'Firefox > 20']})
    ]
  };
  ```
+ 配置rules
  <span class="filename">webpack-config/dev.js<span>
  ```
  module.exports = webpackMerge(base, {
    ...
    module: {
      rules: [
        ...
        {
          test: /\.scss$/,
          exclude: [/node_modules/],
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            'postcss-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        }
        ...
      ]
    }
    ...
  });
  ```

##### html模板、图片等的处理
+ 安装相关依赖
  ``` bash
  cnpm i -D html-loader file-loader url-loader
  ```
+ 配置rules
  <span class="filename">webpack-config/dev.js<span>
  ```
  module.exports = webpackMerge(base, {
    ...
    module: {
      rules: [
        ...
        {
          test: /\.html$/,
          loader: 'html-loader',
          options: {
            minimize: true
          }
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          loader: 'url-loader',
          options: {
            limit: 10000,
            hash: 'sha512',
            publicPath: '/',
            name: 'assets/images/[hash].[ext]'
          }
        }
        ...
      ]
    }
    ...
  });
  ```
**至此，dev环境配置完成**

### 配置production环境

#### 抽出公共部分
+ entry可以共用，prod的output需要加上文件chunkhash用来刷新缓存,并将文件输出至dist目录
  <span class="filename">webpack-config/dev.js<span>
  ``` js
  - entry: process.cwd() + '/src/index.js',
  ```
  <span class="filename">webpack-config/base.js<span>
  ``` js
  module.exports = {
    entry: process.cwd() + '/src/index.js',
  };
  ```
  <span class="filename">webpack-config/prod.js<span>
  ``` js
  const webpackMerge = require('webpack-merge');
  const base = require('./base');

  module.exports = webpackMerge(base, {
    output: {
      filename: 'bundle.[chunkhash].js',
      path: process.cwd() + '/dist'
    },
  });
  ```
+ HtmlWebpackPlugin公共
  <span class="filename">webpack-config/dev.js<span>
  ``` js
    -new HtmlWebpackPlugin({
    -  filename: 'index.html',
    -  template: process.cwd() + '/src/index.html',
    -  favicon: process.cwd() + '/src/index.html'
    -})
  ```
  <span class="filename">webpack-config/base.js<span>
  ``` js
  const HtmlWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
    ...
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: process.cwd() + '/src/index.html',
        favicon: process.cwd() + '/src/index.html'
      })
    ],
  };
  ```
+ js、html和图片loader公共，prod的css loader需要使用[ExtractTextPlugin](https://webpack.js.org/guides/code-splitting-css/#using-extract-text-webpack-plugin-extracttextplugin)将css从js中分离出来
  <span class="filename">webpack-config/dev.js<span>
  ``` js
  -{
  -  test: /\.js$/,
  -  exclude: [/node_modules/],
  -  loader: 'babel-loader'
  -}
  ...
  -{
  -  test: /\.html$/,
  -  loader: 'html-loader',
  -  options: {
  -    minimize: true
  -  }
  -},
  -{
  -  test: /\.(jpe?g|png|gif|svg)$/i,
  -  loader: 'url-loader',
  -  options: {
  -    limit: 10000,
  -    hash: 'sha512',
  -    publicPath: '/',
  -    name: 'assets/images/[hash].[ext]'
  -  }
  -}

  ```
  <span class="filename">webpack-config/base.js<span>
  ``` js
  ...
  module.exports = {
    ...
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: [/node_modules/],
          loader: 'babel-loader'
        },
        {
          test: /\.html$/,
          loader: 'html-loader',
          options: {
            minimize: true
          }
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          loader: 'url-loader',
          options: {
            limit: 10000,
            hash: 'sha512',
            publicPath: '/',
            name: 'assets/images/[hash].[ext]'
          }
        }
      ]
    }
  };
  ```
  ``` bash
  cnpm i -D extract-text-webpack-plugin@beta
  ```
  <span class="filename">webpack-config/prod.js<span>
  ``` js
  ...
  const ExtractTextPlugin = require("extract-text-webpack-plugin");
  ...
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: [/node_modules/],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true
              }
            },
            'postcss-loader',
            'sass-loader'
          ]
        })
      }
    ]
  },
  ...
  plugins: [
    new ExtractTextPlugin({
      filename: "bundle.[chunkhash].css"
    })
  ],
  ```

#### production环境的其它处理
##### 使用[UglifyJsPlugin](https://webpack.js.org/plugins/uglifyjs-webpack-plugin/#uglifyjs-webpack-plugin)压缩js
``` bash
cnpm i - D uglifyjs-webpack-plugin
```
<span class="filename">webpack-config/prod.js<span>
``` js
...
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
...
module.exports = webpackMerge(base, {
  ...
  const webpack = require('webpack');
  ...
  plugins: [
    ...
    new UglifyJSPlugin({
      compress: {
        warnings: false,
      },
      output: {
        comments: false
      }
    })
    ...
  ]
  ...
})
...
```

##### 使用[CleanWebpackPlugin](https://github.com/johnagan/clean-webpack-plugin)清空output目录
构建前先清空，防止出现垃圾文件
``` bash
cnpm i -D clean-webpack-plugin
```
<span class="filename">webpack-config/prod.js<span>
``` js
...
module.exports = webpackMerge(base, {
  ...
  plugins: [
    ...
    const CleanWebpackPlugin = require('clean-webpack-plugin');
    ...
    new CleanWebpackPlugin(['dist'], {
      root: process.cwd(),
      exclude: []
    })
    ...
  ]
  ...
})
...
```

**至此，production环境配置完毕，同时抽出了公共部分**

### 配置[resolve.alias](https://webpack.js.org/configuration/resolve/#resolve-alias)
+ 开发的时候如果有一个很深的目录比如：src/a/b/c/d/, 然后在d目录下的一个模块需要引入a目录下的模块，需要这样写：`import '../../../some-module'`，为了方便可以配置一个为src目录配置一个alias，这样模块引入只需要这样写：`import src/a/some-module`。
<span class="filename">webpack-config/base.js<span>
``` js
...
const path = require('path');
...
module.exports = {
  ...
  resolve: {
    extensions: ['.js'],
    alias: {
      src: path.resolve(__dirname, './../src')
    }
  }
  ...
};
```
+ 通常dev环境和production环境的配置参数比如api domain会有差异，所以需要利用alias将用户两个环境配置文件区分开来
  *src目录下新建config目录，src/config目录下新增三个文件：base.js、dev.js、prod.js*
  <span class="filename">webpack-config/base.js<span>
  ``` js
  export default {
    version: '1.0.0'
  }
  ```
  <span class="filename">webpack-config/dev.js<span>
  ``` js
  import base from './base'

  export default {
    ...base,
    env: 'dev'
  }
  ```
  <span class="filename">webpack-config/prod.js<span>
  ``` js
  import base from './base'

  export default {
    ...base,
    env: 'prod'
  }
  ```
  *配置alias*
  <span class="filename">webpack-config/dev.js<span>
  ``` js
  ...
  const path = require('path');
  ...
  module.exports = webpackMerge(base, {
    ...
    resolve: {
      alias: {
        config: path.resolve(__dirname, './../src/config/dev.js')
      }
    }
    ...
  })
  ...
  ```
  <span class="filename">webpack-config/prod.js<span>
  ``` js
  ...
  const path = require('path');
  ...
  module.exports = webpackMerge(base, {
    ...
    resolve: {
      alias: {
        config: path.resolve(__dirname, './../src/config/prod.js')
      }
    }
    ...
  })
  ...
  ```
## 最终成果
https://github.com/mlxiao93/webpack-demo
