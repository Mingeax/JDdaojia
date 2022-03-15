# JDdaojia

## 简介

JDdaojia是模仿[**京东到家**](http://www.jddj.com/#/)而构建的web移动端电子商城，本仓库是它的前端项目．后端api接口部分见： [JDdaojia-backAPI](https://github.com/Mingeax/JDdaojia-backAPI 'JDdaojia-backAPI')．

本项目实现了电子商城用户端的基本操作，包括登录注册、商店商品展示、购物车、下订单、历史订单查询、保存和编辑地址等功能，并尽力还原了京东到家特有的UI风格．

## 所用技术
+ vue3 + vuex + vue-router + vue-cli
+ axios
+ ESLint
+ webpack
+ scss
+ ES6

## 命令行基本操作:
### 安装项目 Project setup
```
npm install
```

### 在开发环境下编译和热重载 Compiles and hot-reloads for development
```
npm run serve
```

### 在生产环境下编译并压缩合并 Compiles and minifies for production
```
npm run build
```

### 对文件进行lint和修复 Lints and fixes files
```
npm run lint
```

### 自定义配置 Customize configuration
见 See : <br/>[Configuration Reference](https://cli.vuejs.org/config/).

## 运行成功
如果过程顺利,项目在dev环境下运行成功后,命令行会显示类似下面的提示.

![dev运行成功的提示](/readme-asset/dev-running-info.jpg "运行成功")

使用其中给出的URL即可访问页面.但此前应该先运行项目的[后端接口](https://github.com/Mingeax/JDdaojia-backAPI 'JDdaojia-backAPI')服务器,默认使用3000端口.

## 提示
+ 可通过 用户名: admin , 密码: admin 直接登录商城,绕过注册环节.另外,商城现在没有手机短信登录功能,请使用用户名密码登录.
+ 项目使用rem方案实现自适应布局.
+ 项目只在Firefox和Edge浏览器上测试过,Chrome和Safari浏览器可能会遇到布局bug,如有发现请联系我予以修改.
+ 布局充分利用flex,简化了css代码.
+ 购物车功能主要利用vuex和sessionStorage在客户端管理数据,这是我为了练习本地化信息管理能力.其他功能则主要在后端处理数据.
+ 登录信息储存在sessionStorage中.

## 改进方向
+ 在页面加载性能和展示上仍有改进空间,比如使用Cache、减少布局抖动等.
+ 在浏览器的某些设置下,即使关闭页面也不会清空sessionStorage.可设定隔一段时间不操作页面后,自动退出登录并清除sessionStorage.
+ 很多使用HTTP请求的部分,可以采用更具体的错误处理方式.