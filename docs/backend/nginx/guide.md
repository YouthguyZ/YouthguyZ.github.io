# Hello Nginx

## 什么是 Nginx

## 安装

在 Mac OS 中，使用 `brew` 安装非常简单
```
brew install nginx
```

安装完成以后，nginx 会被自动的配置为环境变量，我们可以使用 `nginx -v` 来查看当前安装 nginx 的版本：

```bash
nginx -v
# nginx version: nginx/1.15.10
```

## 基本命令

### 启动 nginx ：

```
nginx
```

此时默认的会在本机的8080端口开启服务，打开 [http://localhost:8080/](http://localhost:8080/) 可以看到如下界面，证明运行成功：

![hello nginx](../images/nginx-hello.png)

### 关闭 nginx

```
nginx -s stop
```

### 重新加载

```
nginx -s reload
```

一般我们在修改 nginx 配置文件修改后需要重新加载配置文件，让最新的修改生效。