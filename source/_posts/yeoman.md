---
title: 使用yeoman生成项目脚手架
date: 2017-5-22 21:38:48
tags:
 - js
---

> http://yeoman.io/

<!-- more -->

## 什么是[yeoman](http://yeoman.io/)
yeoman提供一些接口制作generator，并且可以下载下来执行，用于定制和生成项目脚手架

*脚手架: 项目初始阶段的目录结构、配置文件和一些全局公用的逻辑代码，可被复用于新项目*
*generator: 定制脚手架的项目，generator被yeoman执行后可生成项目*

安装： `npm install -g yo`

## 为什么要使用yeoman
**生成新项目**
+ 方案一：从零开始写或者拷贝老项目的部分代码。缺点：费时费力
+ 方案二：利用vue-cli之类的cli工具生成。缺点：局限性大，不可定制
+ 方案三：使用yeoman定制脚手架并生成项目

**生成新页面**
*实际项目中，新页面会放在指定目录中，并且可能会存在初始的一些重复代码（包括用于该页面的action，store，service等）*
+ 方案一：手动新建各种文件，然后写初始代码。缺点：重复、繁琐
+ 方案二：使用yeoman自动生成页面和与其相关的初始代码和文件

## 怎样使用yeoman
### 编写generator
**初始化generator项目**
+ 目录结构
  ```
  ├───package.json
  └───generators/
      └───app/
          └───index.js
          └───templates/
  ```
+ package.json
  ``` json
  {
    "name": "generator-sample-vue",    //name必须以generator-开头
    "version": "1.0.0",
    "description": "sample dashboard project using vue and vue-router",
    "keywords": [
      "yeoman-generator",        //keywords必须包含yeoman-generator
    ],
    "dependencies": {
      "yeoman-generator": "^1.1.1"
    }
  }
  ```
+ generators/app/index.js   
  ```
  var Generator = require('yeoman-generator');
  module.exports = class extends Generator {
    //下文提到的方法均放与此处，yeoman会自动执行
  };
  ```
+ 执行`npm link`，使generator在本地可用

**写好脚手架模板，并放入templates目录**
  ```js
  writing() {
    this.fs.copyTpl(
      this.templatePath('./'),
      this.destinationPath('./'), {

      });
  }
  ```
**询问项目信息，在模板对应的地方做替换（模板替换使用的是[ejs](https://github.com/tj/ejs)语法）。以项目名称为例:**
  ```js
  prompting() {
    return this.prompt([
      {
        type    : 'input',
        name    : 'projectName',
        message : 'Your project name',
        default : this.appname // Default to current folder name
      }
    ]).then((answers) => {
      this.answers = answers;
    });
  }
  writing() {
    this.fs.copyTpl(
      this.templatePath('./'),
      this.destinationPath('./'),
      this.answers
    );
  }
  ```
  ```
  <%= projectName %>   //package.json的name，index.html的ttile
  ```
**执行npm install安装依赖**
  ```
  installDependencies() {
    this.spawnCommand('npm', ['install'])
  }
  ```

**生成页面**
执行`yo <name>`时默运行`generators/app/index.js`，现在新增一个目录`page`
```
├───package.json
└───generators/
    └───app/
    │   └───index.js
    │   └───templates/
    └───page/
        └───index.js
        └───templates/
```
执行`yo <name>:page`运行`generators/page/index.js`

询问页面名称，拷贝模板、替换变量，输到至指定路径：
``` js
var Generator = require('yeoman-generator');
var fs = require('fs');

prompting() {
  return this.prompt([
    {
      type    : 'input',
      name    : 'pageName',
      message : 'Your page name',
      default : 'new-page'
    }
  ]).then((answers) => {
    answers.pageName = answers.pageName.replace(/\s/g, '-')
    this.answers = answers;
  });
}

writing() {
  var pageName = this.answers.pageName
  this.fs.copyTpl(
    this.templatePath('./page.vue'),
    this.destinationPath(`./src/pages/${pageName}/index.vue`),
    this.answers
  );
}
```
为新页面添加路由和导航：
```js
updating() {      //用语句替换模板上的指定标记
  var that = this;
  var pageName = this.answers.pageName;
  var match = /-(\w)/.exec(pageName);
  var w = match && match[1];
  var pageNameCamelStyle =  w ? pageName.replace(/-\w/, w.toUpperCase()) : pageName

  fs.readFile(that.destinationPath('src/pages/index.js'), {flag: 'r+', encoding: 'utf8'}, function (err, data) {
    if(err) {
     console.error(err);
     return;
    }

    var impt = `import ${pageNameCamelStyle} from './${pageName}'`
    var router = `{
  path: '/${pageName}',
  component: ${pageNameCamelStyle}
},`;

    data = data.replace(/(\/\* yeoman-inject:import DO NOT DELETE OR MODIFY \*\/)/, `${impt}\n$1`);
    data = data.replace(/(\/\* yeoman-inject:router DO NOT DELETE OR MODIFY \*\/)/, `${router}\n$1`);

    fs.writeFile(that.destinationPath('src/pages/index.js'), new Buffer(data), {flag: 'w+'}, function (err) {
       if(err) console.error(err);
    });
  });

  fs.readFile(that.destinationPath('src/components/app-nav/index.vue'), {flag: 'r+', encoding: 'utf8'}, function (err, data) {
    if(err) {
     console.error(err);
     return;
    }

    var link = `<li><router-link to="/${pageName}">${pageNameCamelStyle}</router-link></li>`

    data = data.replace(/(<!-- yeoman-inject:link DO NOT DELETE OR MODIFY -->)/, `${link}\n$1`);

    fs.writeFile(that.destinationPath('src/components/app-nav/index.vue'), new Buffer(data), {flag: 'w+'}, function (err) {
       if(err) console.error(err);
    });
  });

}
```


### 上传generator至npm
```
npm adduser  //如果没有账号，用此命令注册
npm login   //如果有账号，用此命令登陆
npm publish --access=public     //上传到npm官网
```

### 下载generator使用
```
npm install -g generator-sample-vue
yo sample-vue         //生成项目
yo sample-vue:page    //生成新页面
```


---

> 本例generator源码：[https://github.com/mlxiao93/generator-sample-vue](https://github.com/mlxiao93/generator-sample-vue)
