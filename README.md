---
layout:     post
title:      我是如何建站的？
subtitle:   How I built this site？
date:       2022-12-29
author:     CheongSzesuen
header-img: img/post/post-bg-TengPu.webp
catalog: true
tags:
    - 原创
    - 建站
    - 教程
    - HTML
    - Jekyll
    - CSS
    - GitHub
    - CloudFlare
---
# 珠玉在前
- 我需要感谢[毛若昕先生](https://maorx.cn/)的[热铁盒](https://www.retiehe.com/)旗下的[网页托管](https://host.retiehe.com/)：这也许对于我并不是一个很好的网页托管平台，但它发挥了抛砖引玉这个最重要的作用，让我开始接触「前端」
<br>
- 感谢[W3School](https://www.w3school.com.cn/)、[Runoob（菜鸟教程）](https://www.runoob.com/)、[W3Cschool](https://www.w3cschool.cn/)和[MDN](https://developer.mozilla.org/)：它们教我HTML、CSS、Javascript。
<br>
- 感谢[创客贴](https://www.chuangkit.com/)：我使用它的工具做了[BLOG网站](https://wbza.tk/)和[主站](https://cheongszesuen.cf/)的图标。
<br>
- 感谢[GitHub](https://github.com/)以及它的许多极其有用的工具之一[GitHub Pages](https://pages.github.com/)：GitHub为我提供了代码平台，而GitHub Pages则是更重要的网站工作，它可能是我最爱的网站，这里所有人足够谦虚，自由的上传代码。开源是大势所趋！
<br>
- 感谢[Git](https://git-scm.com/)：它是GitHub的核心。
<br>
- 感谢[CloudFlare](https://dash.cloudflare.com/)：它的Pages服务带着GitHub和GitLab，且速度大大增快了。
<br>
- 感谢[MJJ手册](https://mjj.kermsite.com/)和[免费建站资源](https://free.zhelper.net/)，后者更新快详细加载速度慢，前者加载速度快。但它们的内容都差不多~
<br>

- 感谢[工具库](https://www.gjk.cn/)，尤其是它的其中的三个功能[CSS优化](https://www.gjk.cn/css)、[HTML优化](https://www.gjk.cn/html)和[Javascript优化](https://www.gjk.cn/js)：它大大提升了代码的可读性。
<br>

- 感谢[TinyPNG](https://tinypng.com/)以及[格式工厂](http://www.pcfreetime.com/formatfactory/CN/index.html)：我常常用格式工厂将图片转为WebP，再用TinyPNG将WebP压缩，这两个工具大大提升了我网站的加载速度。
<br>

- 感谢[IPaddress](https://www.ipaddress.com/)：它为我提供了查询IP的功能。
<br>

- 感谢[码工具](https://www.matools.com)的[在线网页地址栏favicon图标制作](https://www.matools.com/ico)：虽然后来知道格式工厂也可以完成同样的功能，但它为我提供过帮助。
<br>

- 感谢[GitHub Proxy](https://ghproxy.com/)和[GitHub 文件加速](https://github.91chi.fun/)（它似乎有很多域名）这是他的[GitHub开源地址](https://github.com/hunshcn/gh-proxy)它参考了[EtherDream的代码](https://github.com/EtherDream/jsproxy/)以及著名插件[GitHub加速](https://github.com/fhefh2015/Fast-GitHub)：它们在我下一条感谢之前为我GitHub的下载提供了帮助。
<br>

- 感谢[SwitchHosts](https://github.com/oldj/SwitchHosts/releases)和[GitHub520](https://github.com/521xueweihan/GitHub520)：这两个工具套在一起用让我的GitHub体验更好了。
<br>

- 感谢[Freenom](https://www.freenom.com/)：它绝对是我建站中的重中之重之一，它为我提供了免费的顶级域名！
<br>

- 感谢[Wallhaven](https://wallhaven.cc/)：它为我提供了足够好也足够多的壁纸。
<br>

- 感谢[不知名的时间线作者](https://link.jianshu.com/?t=http%3A%2F%2Ffreefrontend.com%2Fassets%2Fzip%2Fcss-timelines%2Fhyperloop-timeline.zip)：预览网站已经没了，下载会提示不安全。我的主站历程是按照这个模板的。
<br>

- 感谢黄玄先生的[BLOG模板](https://github.com/Huxpro/huxpro.github.io)，这是他的[GitHub地址](https://github.com/Huxpro/)，这是他的[知乎地址](https://www.zhihu.com/people/huxpro)，这是他的[微博地址](https://weibo.com/huxpro)，这是他的[BiliBili地址](https://space.bilibili.com/43271611/)：他的模板很流行，写的很好，这是我的BLOG的来源。
<br>

- 感谢[Bebop的BLOG](http://bebop.pub/)，在我搜索万青的解读时，我搜到了他的BLOG，这是他的[GitHub仓库地址](https://github.com/TheWastedYears/TheWastedYears.github.io)：他让我开始研究BLOG。
<br>

- 感谢[qiubaiying的BLOG](https://qiubaiying.github.io/)，再深入发现Bebop是fork的他的仓库，这是他的[GitHub仓库地址](https://github.com/qiubaiying/qiubaiying.github.io)：我开始莽撞的搭建BLOG网站。并深入到Hux黄玄的仓库。
<br>

- 感谢[一个我忘记网址的模板]：我开始做一个静态音乐播放器，大重启了两次，都失败了。

# 前言
在建站过程中，踩了很多坑，但我经常秉着一个意念，电脑应该多点、多试、多错、多学、多搜，这样无论如何都会达到目标。
以下教程极其详细，是面对小白的。
**<center>看看电脑博客的样式：</center>**
<center><img src="/img/JianZhan/wbza-PC.webp" alt="我不知啊2022年12月29日主页截屏" title="2022年12月29日电脑端截屏"></center>

**<center>看看手机博客的样式：</center>**
<center><img src="/img/JianZhan/wbza-Phone.webp" alt="我不知啊2022年12月29日主页截屏" title="2022年12月29日电脑端截屏"></center>

# 一、开始
## （一） 需要一个GitHub账号
我使用GitHub Pages+Jekyll。
如果要使用GitHub Pages，那就需要一个GitHub账号，GitHub可能是世界最大的开源网站。如果接触GitHub，那就会发现这简直是一个巨大的宝藏。很多时候会用上GitHub上一些大佬的杰作，注册一个绝对不亏。
**<center>下面图文很多，GitHub加载缓慢，请耐心等待呐</center>**
### 1. 注册
#### （1）点击右上角的Sign up（注册）
<center><img src="/img/JianZhan/post-JianZhan-1.webp" alt="我不知啊2022年12月29日截屏" title="2022年12月29日电脑端截屏"></center>

#### （2）输入一个邮箱并点击Continue（继续）
<center>翻译一下：</center>

>**<center>Enter you email</center>**

**<center>输入您的电子邮件地址</center>**
<center><img src="/img/JianZhan/post-JianZhan-2.webp" alt="GitHub2022年12月29日截屏" title="2022年12月29日GitHub截屏"></center>

#### （3）输入一个密码并点击Continue（继续）
<center>翻译一下：</center>

>**<center>Create a password</center>**

**<center>创建一个密码</center>**
create这个词会在GitHub高频出现请务必记住它。
<center><img src="/img/JianZhan/post-JianZhan-3.webp" alt="GitHub2022年12月29日截屏" title="2022年12月29日GitHub截屏"></center>

#### （4）输入一个名字并点击Continue（继续）
***!WARING!*** GitHub的名字是**唯一**的 ***!WARING!***<br>
GitHub我最近一次注册的时候感觉很抽风，有时候输入一个名字不能使用，然后删掉一个字母再加上，就又行了，魔幻……所以可以多试几次~。当然名字也可以以后再改
<center>翻译一下：</center>

>**<center>Enter a username</center>**

**<center>输入一个用户名</center>**
<center><img src="/img/JianZhan/post-JianZhan-4.webp" alt="GitHub2022年12月29日截屏" title="2022年12月29日GitHub截屏"></center>

#### （5）选择是否让GitHub通过邮箱给你发送通知
个人觉得反正邮箱现在就是个验证码收集箱……我选的y，感觉用起来也好，你在仓库的讨论，别人回复你会在邮箱收到通知。
<center>翻译一下：</center>

>**<center>Would you like to receive product updates and announcements via email?
Type "y" for yes or "n" for no</center>**

**<center>您希望通过电子邮件接收产品更新和通知吗？
输入"y”表示是，输入"n”表示否</center>**
<center><img src="/img/JianZhan/post-JianZhan-5.webp" alt="GitHub2022年12月29日截屏" title="2022年12月29日GitHub截屏"></center>

#### （6）进行人机验证（看你是不是机器）并点击create account（创建账户）
<center>翻译一下：</center>

>**<center>Verify your account</center>**

**<center>验证你的账户</center>**
这个内容不怎么一样，我最近一次注册，让我认星云……
<center>（所以这里没有图捏）</center>

#### （7）输入邮箱GitHub发来的验证码
<center>翻译一下：</center>

><center>You're almost done!<br>
>We sent a launch code to XXXX@XXXXX.com

>Didn't get your email? Resend the code or update your email address.</center>

**<center>你快完成了！
我们发送了一个验证码到XXXX@XXXXX.com<br>
Didn't get your email? Resend the code or update your email address.</center>**

因为我是拿的一个僵尸号完成前面的注册，所以不会有验证码。估计输个验证码就注册完了。
<center>（所以这里没有图捏）</center>

## 二、拉取黄玄先生或者我的模板
### （1）点击左上角的输入框
<center><img src="/img/JianZhan/post-JianZhan-6.webp" alt="GitHub2022年12月30日截屏" title="2022年12月30日GitHub截屏"></center>

#### （2）输入`Cheong-Szesuen.github.io`并按下键盘的<kbd>Enter</kbd>或者<kbd>回车</kbd>
<center><img src="/img/JianZhan/post-JianZhan-7.webp" alt="GitHub2022年12月30日截屏" title="2022年12月30日GitHub截屏"></center>

#### （3）点击`Cheong-Szesuen/Cheong-Szesuen.github.io`
<center><img src="/img/JianZhan/post-JianZhan-8.webp" alt="GitHub2022年12月30日截屏" title="2022年12月30日GitHub截屏"></center>

#### （4）点击右上角的Fork
我的界面可能跟你看到的不太一样，有些是扩展加上去的，不过不需要管它们，fork没有被改，所以直接点fork就行啦
<center><img src="/img/JianZhan/post-JianZhan-9.webp" alt="GitHub2022年12月30日截屏" title="2022年12月30日GitHub截屏"></center>

#### （5）修改Repository name（仓库名）并点击Create fork（创建一个fork）
修改==Cheong-Szesuen==为你的==用户名==，就是左边的那个，照着替换了就行。比如==CheongSzesuen.github.io== 。下边有个Description（介绍）也可以修改，可选可不选，可以把我的介绍删了。其他的就不要改了。
<center><img src="/img/JianZhan/post-JianZhan-10.webp" alt="GitHub2022年12月30日截屏" title="2022年12月30日GitHub截屏"></center>
然后会自己跳转到fork完的页面
<center><img src="/img/JianZhan/post-JianZhan-11.webp" alt="GitHub2022年12月30日截屏" title="2022年12月30日GitHub截屏"></center>

### 三、开始部署GitHub Pages
#### （1）点击上方的Setting（设置）
<center><img src="/img/JianZhan/post-JianZhan-12.webp" alt="GitHub2022年12月30日截屏" title="2022年12月30日GitHub截屏"></center>

#### （2）点击左边的列表中的Pages（页面）
<center><img src="/img/JianZhan/post-JianZhan-13.webp" alt="GitHub2022年12月30日截屏" title="2022年12月30日GitHub截屏"></center>

#### （3）点击Depoly from a branch（从一个分支部署）
<center><img src="/img/JianZhan/post-JianZhan-14.webp" alt="GitHub2022年12月30日截屏" title="2022年12月30日GitHub截屏"></center>

#### （4）点击GitHub Actions
点完后会自动刷新，点完后就是下图这样子
<center><img src="/img/JianZhan/post-JianZhan-15.webp" alt="GitHub2022年12月30日截屏" title="2022年12月30日GitHub截屏"></center>

#### （5）Pages 页面出现下图的样子就是好了
<center><img src="/img/JianZhan/post-JianZhan-16.webp" alt="GitHub2022年12月30日截屏" title="2022年12月30日GitHub截屏"></center>

#### （6）这时候在浏览器的地址栏输入==你的GitHub名字.github.io==就会出现页面

#### 如果出现下面的页面，请检查仓库名或者输入的地址
<center><img src="/img/JianZhan/post-JianZhan-18.webp" alt="GitHub2022年12月30日截屏" title="2022年12月30日GitHub截屏"></center>

##### 如何修改仓库名？
###### （1）点击仓库界面的Setting
<center><img src="/img/JianZhan/post-JianZhan-12.webp" alt="GitHub2022年12月30日截屏" title="2022年12月30日GitHub截屏"></center>

###### （2）点击中间的输入框改完之后点击Rename（重命名）
<center><img src="/img/JianZhan/post-JianZhan-19.webp" alt="GitHub2022年12月30日截屏" title="2022年12月30日GitHub截屏"></center>

### 四、修改
#### （一）一些工具
这一大节，我觉得最好有个GitHub Desktop和Visual Studio Code，会方便很多，下面会教有GitHub Desktop的方式，如果你熟练Git也可以~
如果你是32位电脑就用不了GitHub Desktop咯，GitHub Desktop只有64位。
##### 1.如何下载Git或GitHub Desktop
因为GitHub Desktop下载速度太太太太太太慢，Git还好有镜像网站（只有windows），<a target="_blank" href="https://npm.taobao.org/mirrors/git-for-windows/">戳我通往Git镜像网站<a>

我放个网盘链接。解释一下，32bit是32位电脑的，64bit是64位电脑的，如果不知道可以右键“我的电脑”或“此电脑”查看RAM（内存）是否大于2GB，大于2GB就是64位电脑。
阿里云和其他有点不一样，因为阿里云分享mac的GitHub的zip的时候提示不能分享，所以把它解压了，提示选择文件过多无法分享.....我把阿里云的GitHub Desktop删了。

<a target="_blank" href="https://npm.taobao.org/mirrors/git-for-windows/">百度云链接<a>[百度云链接](https://pan.baidu.com/s/1NMg6thq9ByybKpvKTKkitg?pwd=Git6)<br>
<a target="_blank" href="https://npm.taobao.org/mirrors/git-for-windows/">阿里云链接<a>[阿里云链接](https://www.aliyundrive.com/s/Ye4mQmJQEeQ)<br>
<a target="_blank" href="https://npm.taobao.org/mirrors/git-for-windows/">蓝奏云链接<a> 密码:1f1w<br>
<a href="/download/GitHub&Git/Git-2.20.1-64-bit.exe" download="Git-2.20.1-64-bit.exe">本站下载Git</a> | <a href="/download/GitHub&Git/GitHubDesktopSetup.exe" download="GitHubDesktopSetup.exe">本站下载Windows版GitHub Desktop</a> | <a href="/download/GitHub&Git/MacGitHubDesktop.zip" download="MacGitHubDesktop.zip">本站下载Mac版GitHub Desktop</a>



##### 2.如何下载Visual Studio Code
首先到[Visual Studio Code的官网](https://code.visualstudio.com/)。下面会分成32位和64位分别讲述
###### a.Windows64位
如果你是Windows，那么中间会显示Download for Windows（下载Windows版本）然后会发现下载速度奇慢（靠！今天是2022年12月30日，奇了！VScode下载速度居然不慢了！），所以，复制下载链接，是这样一串链接`https://az764295.vo.msecnd.net/stable/e8a3071ea4344d9d48ef8a4df2c097372b0c5161/VSCodeUserSetup-x64-1.74.2.exe`到关键了，把`az764295.vo.msecnd.net`这部分换成`vscode.cdn.azure.cn`再建一个新标签页，输入替换完的`https://vscode.cdn.azure.cn/stable/e8a3071ea4344d9d48ef8a4df2c097372b0c5161/VSCodeUserSetup-x64-1.74.2.exe`就会下载了。
###### b.Mac
如果你是Mac，那么中间会显示Download Mac Universal（下载Mac通用版）然后会发现下载速度奇慢（靠！今天是2022年12月30日，奇了！VScode下载速度居然不慢了！），所以，复制下载链接，是这样一串链接`https://az764295.vo.msecnd.net/stable/e8a3071ea4344d9d48ef8a4df2c097372b0c5161/VSCode-darwin-universal.zip`到关键了，把`az764295.vo.msecnd.net`这部分换成`vscode.cdn.azure.cn`再建一个新标签页，输入替换完的`https://vscode.cdn.azure.cn/stable/e8a3071ea4344d9d48ef8a4df2c097372b0c5161/VSCode-darwin-universal.zip`就会下载了。
##### c.Windows32位
点击右上角Download，会看到Windows标志下有四行`x86`，随便点个，然后会发现下载速度奇慢（靠！今天是2022年12月30日，奇了！VScode下载速度居然不慢了！），所以，复制下载链接，是这样一串链接`https://az764295.vo.msecnd.net/stable/e8a3071ea4344d9d48ef8a4df2c097372b0c5161/VSCodeUserSetup-ia32-1.74.2.exe`到关键了，把`az764295.vo.msecnd.net`这部分换成`vscode.cdn.azure.cn`再建一个新标签页，输入替换完的`https://vscode.cdn.azure.cn/stable/e8a3071ea4344d9d48ef8a4df2c097372b0c5161/VSCodeUserSetup-ia32-1.74.2.exe`就会下载了。

#### （二）网站的结构
```
├── _doc
|   ├── SomeArticle.md
├── _includes
|   ├── about
|   |   ├── en.md
|   |   └── zh.md
|   ├── posts
|   |   ├── en.md
|   |   └── zh.md
|   ├── featured-tags.html
|   ├── footer.html
|   ├── friends.html
|   ├── head.html
|   ├── intro-header.html
|   ├── mathjax_support.html
|   ├── multilingual-sel.html
|   ├── nav.html
|   ├── search.html
|   ├── short-about.html
|   ├── sns-links.html
|   └── header.html
├── _layouts
|   ├── default.html
|   ├── keynote.html
|   ├── page.html
|   └── post.html
├── _posts
|   ├── SomeArticle.textile
|   └── SomeArticle.md
├── css
├── fonts
|   ├── glyphicons-halflings-regular.eot
|   ├── glyphicons-halflings-regular.svg
|   ├── glyphicons-halflings-regular.ttf
|   ├── glyphicons-halflings-regular.woff
|   └── glyphicons-halflings-regular.woff2
├── img
|   ├──post
|   |    ├──A article title
|   |    |   └──some photos.webp
|   |    └──A article title
|   |        └──some photos.webp
|   ├── some photos.webp
├── js
|   ├── animatescroll.min.js
|   ├── archive.js
|   ├── bootstrap.js
|   ├── bootstrap.min.js
|   ├──CheongSzesuen Blog.js
|   ├──CheongSzesuen Blog.min.js
|   ├── jquery.js
|   ├── jquery.min.js
|   ├── jquery.nav.js
|   ├── jquery.tagcloud.js
|   ├── simple-jekyll-search.min.js
|   ├── snackbar.js
|   └── sw-registration.js
├──less
|   ├── CheongSzesuen-Blog.less
|   ├── highlight.less
|   ├── mixins.less
|   ├── search.less
|   ├── side-catalog.less
|   ├── sidebar.less
|   ├── snackbar.less
|   └── variables.less
├──pwa
|   ├── icons
|   |   ├── 128.png
|   |   └── 512.png
|   ├── manifest.json
├── _config.yml
├── .gitignore
├── 404.html
├── about.html
├── archive.html
├── feed.xml
├── Gemfile
├── Gruntfile.js
├── index.html
├── offline.html
├── package-lock.json
├── package.json
├── Rakefile
├── search.json
└── sw.js
```
看不懂？如果只是改改也不需要看懂，下面会教怎么更改。
#### （三）用Git或GitHub Desktop Clone（克隆）下来
##### GitHub Desktop
###### 1.用刚才fork的账户登录GitHub Desktop（GitHub Desktop是没有中文的，所以得摸索）
###### 3.点击左上角`File`
###### 4.点击`Clone Repository`
###### 5.点击Your repositories下显示的你fork的那个仓库
###### 6.可以选择克隆的Local path（本地路径）（注意个本地的文件夹必须是空的）
###### 7.点击`Clone`（这一步可能会频繁失败，所以要多试，如果有VPN那更好，记得打开再克隆）
###### 6.然后点击`Open in Visual Studio Code`
###### 7.当完成一整个修改或者写文章的操作，请点击左下角的`Summary(required)`和`Description`填写更新信息。
###### 8.并点击`Commit to main`
###### 9.再点击右方一个蓝色的`push origin`（可能要多试几次，不稳定，看到蓝色的框不见了，就是好了）
##### Git
###### 1.Git如何连接GitHub请学习[廖雪峰](https://www.liaoxuefeng.com/wiki/896043488029600)先生的Git教程，简明易懂
###### 1.在本地创建一个文件夹，文件夹不要有任何东西。
###### 2.打开，然后右击在你的本地根目录，右击新建，选择git base here
###### 4.在你刚fork创建的仓库点击一个绿色的`Code`
###### 5.复制https或者SSH值
###### 6.在刚打开的Git命令行窗口输入下方的命令
```
$ git clone 刚复制的https或SSH值
```
###### 7.按下<kbd>Enter</kbd>或者<kbd>回车</kbd>键（这一步可能会频繁失败，所以要多试，如果有VPN那更好，记得打开再克隆）
###### 8.然后打开文件夹右键`通过code打开`

#### （四）修改_config.yml
##### 1.什么是_config.yml?
_config是这个BLOG网站的全局的部署文件
##### 2.更改
###### 基础设置
```
# Site settings
title: 我不知啊      #你的BLOG标题
SEOTitle: 我不知啊   #SEO标题是搜索引擎搜出来的标题
header-img: "img/home-bg.webp"   # 这是首页的背景图片
email: X2430442963X@outlook.com  #你的邮箱
description: "和光同尘."          #你的简介
keyword: "张思璇, CheongSzesuen, HTML, 网站, CSS, BLOG，blog, ZSX, cheongszesuen, cheong-szesuen"  #哪些是网站的关键字，用于搜索
url: "https://wbza.tk" # 你的网站地址
baseurl: "" # 举个例子, '/blog' 如果你的blog托管在 'host/blog'
```
###### 社交信息
```
RSS: false
weibo_username_none: CheongSzesuen      #这是微博不带的
weibo_username_u: CheongSzesuen         #这是微博带u的
zhihu_username: CheongSzesuen       #这是知乎的
github_username: CheongSzesuen      #这是GitHub的
youtube_channel: UCYEbo0NW0UG1IrzD9X4_V7Q       #这是YouTube的
twitter_username: CheongSzesuen     #这是推特的
facebook_username:  CheongSzesuen       #这是脸书的
linkedin_username:  firstname-lastname-idxxxx       #这是领英的
```
如果你没有其中的一些账号，或者你不会正确指向。请你注释掉相对应的，注释请使用`#`加在这行的前边

下面会说分别怎么设置。
微博，首先进入你的微博个人主页，看地址栏，我发现有两种，一种是`https://weibo.com/u/`+`一串东西`，一种是`https://weibo.com/`+`直接加了一串东西`第二种后面跟的可能自己比较熟悉，可能是自己的最开始的用户名。

首先看自己是带不带`u`的，不带u就在`weibo_username_none:  XXXXX`这里把XXXX替换掉，然后把`weibo_username_u: XXXXX`注释掉，也就是在前边加`#`。

带u就在`weibo_username_u:  XXXXX`这里把XXXX替换掉，然后把`weibo_username_none: XXXXX`注释掉，也就是在前边加`#`。


知乎
让我们看看知乎个人主页的链接形式，拿我的举例，`https://www.zhihu.com/people/luminouszhu-jiang-wan`他的形式是`https://www.zhihu.com/people/`+`最开始创建用户的名字`（[但是这个后边加的这段是可以更改的，但只能更改一次](https://www.zhihu.com/settings/account)。<br>
`zhihu_username`后面接的就是你个人主页的后边那串，我的就是`luminouszhu-jiang-wan`。那我`zhihu_username`后面就应该写`luminouszhu-jiang-wan`，而我的用户名实际是`CheongSzesuen`所以这个得看实际情况。


GitHub

我带了两个GitHub一个是大号一个是小号的……只有一个的可以直接注释掉，前边加个`#`。Github还好，主页名是跟着换的。还是那样，到自己的GitHub主页，看`http://github.com/`后边跟的是什么，把后边跟的复制到`github_username: `后边。


Youtube

老规矩，到YouTube个人频道，看地址栏，是`https://www.youtube.com/channel/`+`一串奇怪的东西`。把这串奇怪的东西复制到`youtube_channel: `后。


Twitter、FaceBook、

还是老规矩，领英没用过……
###### 百度和Google的统计
```
# Analytics settings
Baidu Analytics
ba_track_id: [你的track id]

Google Analytics
ga_track_id: "UA-49627206-1" # Format: UA-xxxxxx-xx
#ga_domain: huangxuan.me
```
集成了[百度统计](https://tongji.baidu.com/web/welcome/login)和[Google统计](https://marketingplatform.google.com/about/)。若不想启用统计，直接删除或注释掉就可以了
###### 侧栏
```
# Sidebar settings
sidebar: true   #是否使用侧栏
sidebar-about-description: "和光同尘"   #头像下的一句话，介绍一下你自己~
sidebar-avatar: /img/Cheong Szesuen.jpg # 使用绝对路径，绝对路径是从根目录的文件夹开始直到目标的文件路径
```
###### 好友（友情链接）
```
# Friends
friends:
  [
    { title: "我的个人网站", href: "http://cheongszesuen.ml/" },   #title后边的双引号里是地址要显示的名字，href:"这里是网站地址"
    { title: "HHZ", href: "https://https://dangerous-hhz.rth1.one/" },
  ]
```
###### 文章标签
```
# Featured Tags
featured-tags: true #是否使用featured tags
featured-condition-size: 1 # 如果标签使用的次数大于指定的值，则会出现在右侧
```
###### PWA渐变式网页软件
```
# Progressive Web Apps
chrome-tab-theme-color: "#000000"
service-worker: true
```
如果你是Chrome、Edge或Safari用户，那进入这个blog网站，地址栏右方会显示一个图标，点击可以让这个blog网站作为一个软件安装。

###### Keynote Layout

HTML5幻灯片的排版：

![](http://huangxuan.me/img/blog-keynote.jpg)

这部分是用于占用html格式的幻灯片的，一般用到的是 Reveal.js, Impress.js, Slides, Prezi 等等.我认为一个现代化的博客怎么能少了放html幻灯的功能呢~

其主要原理是添加一个 `iframe`，在里面加入外部链接。你可以直接写到头文件里面去，详情请见下面的yaml头文件的写法。

```
layout:     keynote
iframe:     "http://huangxuan.me/js-module-7day/"
```

iframe在不同的设备中，将会自动的调整大小。保留内边距是为了让手机用户可以向下滑动，以及添加更多的内容。
#### （五）修改文件
##### 1. 根文件夹下的
###### （1）index.html文件
首先看头文件，description也就是标题下面的小字。可以更改成自己想要的。
```
layout: page
description: "其义自见"
```
再看第32行到45行，那里的`上一页`本来是`NEWER POSTS`，那里的`下一页`本来是`OLDER POSTS`，我感觉还是中文好。
```
<!-- Pager -->
{% if paginator.total_pages > 1 %}
<ul class="pager">
    {% if paginator.previous_page %}
    <li class="previous">
        <a href="{{ paginator.previous_page_path | prepend: site.baseurl | replace: '//', '/' }}">&larr; 上一页</a>
    </li>
    {% endif %}
    {% if paginator.next_page %}
    <li class="next">
        <a href="{{ paginator.next_page_path | prepend: site.baseurl | replace: '//', '/' }}">下一页 &rarr;</a>
    </li>
    {% endif %}
</ul>
{% endif %}
```
###### （2）about.html文件
首先看头文件，title就是会在页面标题和背景图上面的大字，可以改，不过感觉不需要改。<br>description也就是标题下面的小字。可以更改成自己想要的。<br>header-img就是背景图，使用绝对路径，不知道什么事绝对路径就去搜一搜，就是要从根目录开始的路径。
```
layout: page
title: "关于我"
description: "「我们将会在没有黑暗的地方见面」"
header-img: "img/about-bg.webp"
header-mask: 0.3
multilingual: true
```
###### （3）archive.html文件
首先看头文件，title就是会在页面标题和背景图上面的大字，可以改，我翻译不出一个好的，本来是`Archive`，如果你有好的建议可以给我的仓库[Issues](https://github.com/Cheong-Szesuen/Cheong-Szesuen.github.io/issues)一下。<br>description也就是标题下面的小字。可以更改成自己想要的。<br>header-img就是背景图，使用绝对路径。
```
title: 分类
layout: default
description: "「我干了什么 究竟拿了时间换了什么」"
header-img: "img/archive-bg.webp"
```
###### （4）404.html文件
首先看头文件，title就是会在页面标题和背景图上面的大字，可以改，可以写一句幽默点的话<br>hide-in-nav可以选择true或者false，true代表如果是404页面，那就隐藏导航栏内的404页面，false代表如果是404页面，那么不隐藏导航栏内的404页面。这个没什么用，直接选true就好了。<br>description也就是标题下面的小字。可以更改成自己想要的。<br>header-img就是背景图，使用绝对路径。
```
layout: default
title: 怎么就走错了呢
hide-in-nav: true
description: "[ ' / ' ]"
header-img: img/404-bg.webp
permalink: /404.html
```
###### （4）offline.html文件
首先看头文件，title老规矩，但要告诉用户“阅读过的页面可以在离线时访问”这个内容，如果可以，可以幽默一点。<br>hide-in-nav可以选择true或者false，true代表如果是offlin页面，那就隐藏导航栏内的404页面，false代表如果是404页面，那么不隐藏导航栏内的offline页面。这个没什么用，直接选true就好了。<br>description也就是标题下面的小字。可以更改成自己想要的。<br>header-img就是背景图，使用绝对路径。
```
layout: default
title: 阅读过的页面可以在离线时访问
hide-in-nav: true
description: "[ ' \ ' ]"
header-img: "img/404-bg.webp"
permalink: /offline.html
```
##### 2. _includes文件夹下的
###### （1）双文的个人介绍
进入`_includes`文件夹，再进入`about`，这里有两个文件夹，一个是`en.md`，一个是`zh.md`
在`en.md`下

```
Write down something to describe yourself!
```
在`zh.md`下
```
写点东西来描述你自己!
```
###### （2）网站图标
进入`_includes`文件夹，再进入`head.html`，查看第41行代码。修改后面的路径。或者将你预备的图标，放入img文件夹替换掉也行。我用的png图片，只是因为png可以做透明的效果，可以用用其他的。
```
<link rel="shortcut icon" href="{{ site.baseurl }}/img/favicon.png">
```
###### （3）当md文件是双语的时候切换语言时显示的内容
进入`_includes`文件夹，再进入`multilingual-sel.html`，一般这个不用改。
```
<option value="0" selected> 中文 | Chinese </option>      #可以把中文 | Chinese 改成你想要的
<option value="1"> 英文 | English </option>         #可以把英文 | English 改成你想要的
```
###### （4）导航栏主页的字样
进入`_includes`文件夹，再进入`nav.html`<br>
在第24行，`首页`这两个字可以改成你想要的，比如主页或者其他词。
```
<a href="{{ site.baseurl }}/">首页</a>
```
###### （5）社交信息的网站形式（如果看不懂请不要管它）
进入`_includes`文件夹，再进入`sns-links.html`<br>
举一个栗子，在第33行。
```
<a target="_blank" href="https://www.zhihu.com/people/{{ site.zhihu_username }}">
```
<br>

`target="_blank"`这段表示后边的链接会在新的标签页打开<br>我推测可以继续加社交网站，暂时不知道怎么设置图标，待我学qiubaiying先生加的简书归来后我会继续写。（挖坑）
2023年1月10日学会了，马上说。
##### 3. _layout文件夹下的
###### （1）搜索引擎搜出来显示的图标
进入`_layout`文件夹，再进入`default.html`<br>
看第18行，`<img src="/img/search_icon.png" width="0" height="0" />`我发现这行的地址，对应的图片是搜索引擎搜出来右边的图标。可以改，但是freenom的四大免费顶级域名，好像百度都不收录。不知道其他搜索引擎怎么样，想改就改吧。更改方法还是那，要么改路径，要么换成一模一样的名字替换了。
###### （2）幻灯片的配置页面
进入`_layout`文件夹，再进入`keynote.html`<br>
这个没什么改的，现在我还不会改，先挖个坑再说。
###### （3）疑似页面的结构
进入`_layout`文件夹，再进入`page.html`<br>
页面就是那些，比如home页，about页面之类的。还暂时没有改的头绪。
###### （4）疑似文章页面的结构
进入`_layout`文件夹，再进入`post.html`<br>
还暂时没有改的头绪。
### 五、写文章
#### Markdown
不要被这个语言吓到，实际它很简单，我比较主张直接实操，遇到问题去搜索，甚至不用学。如果要学可以看看[Markdown官方教程](https://markdown.com.cn/basic-syntax/)和[菜鸟教程的Markdown教程](https://www.runoob.com/markdown/md-tutorial.html)
#### 文章的格式
##### 文件的名字
文件的名字是固定的`年-月-日-标题.md`如：`2023-01-01-你好2023.md`
注意：**即便是一月也要写成01，日是同理**
##### 文章的固定格式
博客文章格式采用是**MarkDown+ YAML** 的方式。[YAML](https://www.runoob.com/w3cnote/yaml-intro.html) 就是我们配置 _config文件用的语言。
YAML头文件是这样子的
```
---
layout:     post   				    # 使用的布局（不需要改）
title:      我是标题 	             # 标题 
subtitle:   我是副标题               #副标题
date:       2017-02-06 				# 时间
author:     CheongSzesuen 			# 作者
header-img: img/post-bg-2015.jpg 	#这篇文章标题背景图片
catalog: true 						# 是否归档
tags:								#标签
    - 生活                          
---
我是文章我是文章我是文章我是文章我是文章我是文章我是文章我是文章
```
到这里，网站就正式完工了。
### 五、域名
在这里介绍[Freenom](https://www.freenom.com)，这是为数不多**免费**提供[顶级域名](https://baike.baidu.com/item/%E9%A1%B6%E7%BA%A7%E5%9F%9F%E5%90%8D/2152551)的域名服务商。<br>
它提供`.tk`(南太平洋岛国托克劳Tokelau)`.ml`(马里共和国Republic of Mali) `.ga`（加蓬共和国The Gabonese Republic）`.cf`（中非共和国Central African Republic）`.gq`（赤道几内亚共和国The Republic of Equatorial Guinea）<br>
这些国家因为都比较小，也不怎么发达，所以域名也没什么用，就给Freenom，让Freenom售出，在Freenom上这四个域名可以免费使用一年（不过话说回来我一个ml的域名从八九月到现在2022年12月30日都三四个月了，我当时设置的三个月……不知道怎么搞的。去看了一下，“我的域名”页面以及没有了，但是这域名我还能用……沉默了）<br>
注册域名的过程有些麻烦，我得到域名的过程很艰难，但最终得到了一个有用的方法，所以写在这。我的方法来自这位作者，在这里贴上[原帖地址](https://blog.csdn.net/weixin_46021924/article/details/104859155)。
#### 需要的工具
必须使用==电脑==，和==Chromium Edge==或者其他支持扩展的浏览器
##### 1.下载需要的工具
<a target="_blank" href="https://pan.baidu.com/s/1G13TUSU5WVXpsIszBI8n_A?pwd=free">百度云链接<a><br>
<a target="_blank" href="https://www.aliyundrive.com/s/NuXziubk2Yp">阿里云链接<a><br>
<a target="_blank" href="https://wwxo.lanzouf.com/iC9y90jqvk8f">蓝奏云链接<a><br>
<a href="/download/Freenom.zip" download="Freenom.zip">本站下载</a>
<center><img src="/img/JianZhan/post-JianZhan-20.webp" alt="freenom资源解压内容" title="freenom资源解压内容"></center>

这是解压出来的文件，`gooreplacer.crx`和`Header Editor.crx`是两个插件。`gooreplacer`和`Header Editor`两个文件夹是两个插件对于Chrome和其他需要导入的浏览器的插件文件。`HE-GoogleRedirect.json`是`Header Editor.crx`插件需要的文件。
##### 2.对于Chromium Edge的过程
###### (1)点击浏览器右上角的菜单
<center><img src="/img/JianZhan/post-JianZhan-21.webp" alt="Edge如何安装扩展" title="Edge如何安装扩展"></center>

###### (2)点击扩展
<center><img src="/img/JianZhan/post-JianZhan-22.webp" alt="Edge如何安装扩展" title="Edge如何安装扩展"></center>

###### (3)打开Microsoft Edge加载项
<center><img src="/img/JianZhan/post-JianZhan-23.webp" alt="Edge如何安装扩展" title="Edge如何安装扩展"></center>

###### (4)搜索`Gooreplacer`，并安装
<center><img src="/img/JianZhan/post-JianZhan-24.webp" alt="Edge如何安装扩展" title="Edge如何安装扩展"></center>

###### (4)搜索`Header Editor`，选择后边带有FirefoxBar的版本并安装
<center><img src="/img/JianZhan/post-JianZhan-25.webp" alt="Edge如何安装扩展" title="Edge如何安装扩展"></center>

##### 2.对于Chrome的过程
###### (1)点击浏览器右上角 ⋮ > 更多工具 > 点击扩展程序
<center><img src="/img/JianZhan/post-JianZhan-26.webp" alt="Chrome如何安装扩展" title="Chrome如何安装扩展"></center>

###### (2)在扩展中心打开右上角的`开发者模式`按钮，然后刷新页面，将下载好的两个插件的文件夹直接拖入浏览器
<center><img src="/img/JianZhan/post-JianZhan-27.webp" alt="Chrome如何安装扩展" title="Chrome如何安装扩展"></center>

##### 2.对于360浏览器的过程
###### (1)直接将两个crx文件拖入浏览器

##### 3.设置Header Editor（以Edge做例子）
###### (1)点击右上角的扩展图标，点击`Header Editor`
<center><img src="/img/JianZhan/post-JianZhan-28.webp" alt="设置Header Editor" title="设置Header Editor"></center>

###### (2)点击`管理`
<center><img src="/img/JianZhan/post-JianZhan-29.webp" alt="设置Header Editor" title="设置Header Editor"></center>

###### (3)点击`导出和导入`
<center><img src="/img/JianZhan/post-JianZhan-30.webp" alt="设置Header Editor" title="设置Header Editor"></center>

###### (4)点击`导入`并找到下载的`HE-GoogleRedirect.json`文件
<center><img src="/img/JianZhan/post-JianZhan-31.webp" alt="设置Header Editor" title="设置Header Editor"></center>

###### (5)选中`HE-GoogleRedirect.json`，点击`打开`
<center><img src="/img/JianZhan/post-JianZhan-32.webp" alt="设置Header Editor" title="设置Header Editor"></center>

###### (6)点击保存，成功
<center><img src="/img/JianZhan/post-JianZhan-33.webp" alt="设置Header Editor" title="设置Header Editor"></center>

##### 4. 开始注册
###### （1）进入网站
进入[Freenom](https://my.freenom.com/domains.php)，速度比较慢，务必耐心，注册完就不经常用它了。
<center><img src="/img/JianZhan/post-JianZhan-34.webp" alt="freenom注册域名" title="freenom注册域名"></center>

###### （2）搜索需要的域名
①在`Find your new domain`处输入域名（可以不带顶级域名）<br>
②再按<kbd>Enter</kbd>键。
比如我要注册`wbza.gq`，我输入`wbza`，再按<kbd>Enter</kbd>键。出现下面的页面。
<center><img src="/img/JianZhan/post-JianZhan-35.webp" alt="freenom注册域名" title="freenom注册域名"></center>

第一个右边没有`Get it now!`是因为这是我现在的BLOG地址，被我占用了。

###### （3）选择需要的域名进入cart（购物车）
点击右边的`Get it now!`出现下面的就是加入cart（购物车）了。购物车是我自己意译的，感觉功能差不多。
<center><img src="/img/JianZhan/post-JianZhan-36.webp" alt="freenom注册域名" title="freenom注册域名"></center>

这样就是说明不能用，以及有人注册过了（因为这是我现在的BLOG地址，被我占用了）
<center><img src="/img/JianZhan/post-JianZhan-37.webp" alt="freenom注册域名" title="freenom注册域名"></center>

你可以把几种免费的都加入购物车，我觉得没什么必要，就不了。不要贪心！滥用会被举报！

###### （4）点击Checkout
<center><img src="/img/JianZhan/post-JianZhan-38.webp" alt="freenom注册域名" title="freenom注册域名"></center>

###### （5）选择时间
①选择12个月
<center><img src="/img/JianZhan/post-JianZhan-39.webp" alt="freenom注册域名" title="freenom注册域名"></center>

②点continue。
<center><img src="/img/JianZhan/post-JianZhan-40.webp" alt="freenom注册域名" title="freenom注册域名"></center>

一次搞好，Freenom加载慢，难管理。

###### （6）输入并验证邮箱
①在`Enter Your Email Address`（输入您的电子邮箱地址）处输入一个邮箱地址（可能会在垃圾邮件里，如果没收到请查看插件在不在，地址对不对，垃圾邮件有没有）。
<center><img src="/img/JianZhan/post-JianZhan-41.webp" alt="freenom注册域名" title="freenom注册域名"></center>

②点击`Verify My Email Address`（验证我的电子邮箱地址）然后你会收到一封像下面图片所示邮件一样的邮件（这是我之前注册的时候的邮件）
③点击激活链接（中间最长的那个）
<center><img src="/img/JianZhan/post-JianZhan-42.webp" alt="freenom注册域名" title="freenom注册域名"></center>

###### （7）填写信息
①前面的信息可以随意填写，感觉填个中国的会好一点，似乎有一说，说会看IP所在国家和填写的信息是否相同。Phone Number（电话号码）改成自己的，最下面有一个格子，记得打钩。再点击`Complete Order`。<br>
下面这张图是网络的，我自己注册过了，就不再注册了。<br>
翻译一下从上到下依次是：名字-姓氏-公司名-住址-邮政编码-城市-国家-州/地区-电话号码-电子邮箱地址-密码-再次输入密码。
<center><img src="/img/JianZhan/post-JianZhan-43.webp" alt="freenom注册域名" title="freenom注册域名"></center>

###### （8）查看订单
我倒是没收到邮件，但是不影响注册域名。
点击`Click here to go to your Client Area`（点击这里进入你的客户区）
<center><img src="/img/JianZhan/post-JianZhan-44.webp" alt="freenom注册域名" title="freenom注册域名"></center>

###### （9）查看注册的域名
①点击导航栏的`Services`（服务）
<center><img src="/img/JianZhan/post-JianZhan-45.webp" alt="freenom注册域名" title="freenom注册域名"></center>

②再点`My Domains`（我的域名）会跳转到域名管理页面上
<center><img src="/img/JianZhan/post-JianZhan-46.webp" alt="freenom注册域名" title="freenom注册域名"></center>

###### （10）管理域名
在这里会看到你拥有的所有域名，
<center><img src="/img/JianZhan/post-JianZhan-47.webp" alt="freenom注册域名" title="freenom注册域名"></center>

①点击`Mange Domain`（管理域名）
<center><img src="/img/JianZhan/post-JianZhan-48.webp" alt="freenom注册域名" title="freenom注册域名"></center>

②点击`Management Tools`选择`Nameservsers`
<center><img src="/img/JianZhan/post-JianZhan-49.webp" alt="freenom注册域名" title="freenom注册域名"></center>

③选择`use custom nameservers（enter below）`
<center><img src="/img/JianZhan/post-JianZhan-50.webp" alt="freenom注册域名" title="freenom注册域名"></center>

④在`Nameserver 1`处输入`deborah.ns.cloudflare.com`<br>
⑤在`Nameserver 2`处输入`matias.ns.cloudflare.com`
<center><img src="/img/JianZhan/post-JianZhan-51.webp" alt="freenom注册域名" title="freenom注册域名"></center>

⑥点击`Change Nameservers`
<center><img src="/img/JianZhan/post-JianZhan-52.webp" alt="freenom注册域名" title="freenom注册域名"></center>

上面输入的nameserver是CloudFlare的名称服务器。CloudFlare是我遇到的唯一一个**不用实名**的CDN，而且**免费**。是下一步会说怎么注册CloudFlare。


### 六、CloudFlare
[CloudFlare](https://dash.cloudflare.com/)是个很好的CDN平台，免费，而且不用实名，可以托管域名，可以pages服务，可以进行一些网站安全防护。注册过程比较简单，下面就简单说一下。
#### 1. 注册CloudFlare账号
##### （1）[戳我直达注册页面](https://dash.cloudflare.com/sign-up)
密码的要求：
- 8 个字符
- 1 个数字
- 1 个特殊字符，例如，$、!、@、%、&
- 无前导或尾随空格<br>
下面有个`我愿意偶尔收到有关 Cloudflare 产品、服务和活动的电子邮件更新和特别优惠。`我倒是勾了，感觉挺好，有什么关于你域名的消息就给你发来了，特别优惠广告之类的我倒没见过。<br>
**现在好像有中文，记得选中文**
##### （2）验证邮箱
到你的邮箱验证一下~
##### （3）添加刚注册的网站
比如我，我要输入`wbza.gq`
##### （4）Cloudflare使用方案
直接点**Free**！好用还免费。
##### （5）配置DNS
| Type(类型)| Name(名称) |Content(对应不同类型的内容)|TTL（Time To Live生存时间值）|Proxy status（代理服务器状态）|
| ----------- | ----------- |  ----------- | ----------- | ----------- |
|A| @|一个IPV4地址|默认是自动|默认是开启CloudFlare|
|AAAA|@|一个IPV6地址|默认是自动|默认是开启CloudFlare|
|CNAME|@|一个域名|默认是自动|默认是开启CloudFlare|
下面会介绍网站的解析记录
|记录类型的名称|解释|
| ----------- | ----------- |
|A记录|服务器的IPV4地址，A记录会告诉DNS，我要去这个IPV4地址|
|AAAA记录|服务器的IPV6地址，A记录会告诉DNS，我要去这个IPV6地址|
|CNAME|另个域名地址，会访问到目标域名，但还是会显示设置的域名|
Name（名称），如果设置`@`那就是把这个域名指向，比如如果我写`@`那么代表`wbza.gq`就会解析到后边指向的地方(这个似乎叫Apex域）<br>
如果在这个空内输入点东西，比如我输入`www`，那么`www.wbza.tk`就会通过后边的内容被代理。（也就是一个www子域）<br>
还可以自定义比如我输入`dash`那么`.wbza.tk`通过后边的内容。
###### 你需要设置的解析（记录最多需要24小时生效)
|类型|名称|对应不同类型的内容|TTL|Proxy status|
| ----------- | ----------- |  ----------- | ----------- | ----------- |
| A      | @      |185.199.108.153|自动|开启|
| A      | @      |185.199.109.153|自动|开启|
| A      | @      |185.199.110.153|自动|开启|
| A      | @      |185.199.111.153|自动|开启|
| AAAA   | @        |2606:50c0:8000::153|自动|开启|
| AAAA   | @        |2606:50c0:8000::153|自动|开启|
| AAAA   | @        |2606:50c0:8002::153|自动|开启|
| AAAA   | @        |2606:50c0:8003::153|自动|开启|
下面四个A记录对应的IPV4地址是[GitHub Pages帮助文档显示的](https://docs.github.com/zh/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain)
- 185.199.108.153
- 185.199.109.153
- 185.199.110.153
- 185.199.111.153
下面四个AAAA记录对应的IPV6地址是[GitHub Pages帮助文档显示的](https://docs.github.com/zh/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain)
- 2606:50c0:8000::153
- 2606:50c0:8001::153
- 2606:50c0:8002::153
- 2606:50c0:8003::153
[Github Pages帮助文档说的很明了](https://docs.github.com/zh/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
##### （6）继续
这一步会让你改nameserver，如果你按照这个教程一步一步走，那么这步是前边做过了的，下一步。
##### （7）如果你替换了，那么会显示成功

#### 2. 开始设置网站
##### （1）点击左栏的网站
##### （2）点击添加的域名
##### （3）点击中间快速入门指南的点击设置
##### （4）点击开始使用
##### （5）全部打开

### 七、GitHub上的一点操作
#### 1. 打开[GitHub](https://github.com/)
#### 2. 点击右上角你的头像右边的小三角
#### 3. 点击`Your Repositories`
#### 4. 点击你fork创建的仓库
#### 5. 点击`Setting`
#### 6. 点击`Pages`
#### 7. 拉到底部的Custom domain部分
#### 8. 在输入框输入你的域名，比如我就需要输入`wbza.gq`
#### 9. 点击`Save`
#### 10. 然后上面有个`Visit your site`点击它
#### 11. 你就到了你的网站