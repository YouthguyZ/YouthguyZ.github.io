## Docker 常用命令

### 镜像操作

- 拉取镜像到本地： `docker pull IMAGE_NAME[:IMAGE_TAG]`

- 查看本地全部镜像： `docker images`

- 删除本地镜像：`docker rmi IMAGE_ID`

- 导出本地镜像

```bash
docker save -o OUTPUT_PATH IMAGE_ID

# 比如：`docker save -o ./tomcat-img 123456`
# 表示将镜像 id 为 123456 的镜像，导出到当前目录下，并且名称为 tomcat-img。
```

- 导入（加载）本地的镜像

```bash
docker load -i IMAGE_FILE

# 比如加载上面的镜像：`docker load -i ./tomcat-img`
```

- 给镜像命名：

```bash
docker tag IMAGE_ID NEW_IMAGE_NAME:IMAGE_TAG

# docker tag 123 tomcat-xxx:8.8
```


### 容器的操作

- 运行容器

```bash
docker run IMAGE_ID  # 会运行本地的
docker run IMAGE_NAME[:IMAGE_TAG] # 运行本地的；如果在本地找不到，会去中央仓库下载镜像然后运行

# -d: 后台运行容器
# -p: 宿主机端口:容器端口
# --name 指定容器名称
docker run -d -p HOST_PORT:CONTAINER_PORT --name CONTAINER_NAME IMAGE_ID|IMAGE_NAME[:IMAGE_TAG]
```

- 查看正在运行的容器 

```bash
# -q: 只查看容器的标识，不查看其他信息
# -a: 查看全部的容器，包括没有运行的
docker ps -[qa]
```

- 查看容器的日志

```bash
# 可以滚动查看日志的最后几行
docker logs -f CONTAINER_ID
```

- 进入容器内部

```bash
docker exec -it CONTAINER_ID
```

- 停止容器 

```bash
docker stop CONTAINER_ID

# 停止全部容器
docker stop $(docker ps -qa)
```

- 启动容器

```bash
docker start CONTAINER_ID
```

- 删除容器 

```bash
docker rm CONTAINER_ID

# 删除全部容器
docker rm $(docker ps -qa)
```

- 将宿主机的文件拷贝进容器

```bash
# 将 xxx.zip 放到容器 CONTAINER_ID 的 PATH_TO_PUT 路径下
docker cp xxx.zip CONTAINER_ID:PATH_TO_PUT
```

### 数据卷操作

- 创建数据卷

```bash
docker volume create VOLUME_NAME

# 默认会存放在 /var/lib/docker/volumns/VOLUME_NAME/_data
```

- 查看数据卷

```bash
# 查看某一个数据卷的详细信息
docker volume inspect VOLUME_NAME

# 查看全部的数据卷
docker volume ls
```

- 删除数据卷

```bash
docker volume rm VOLUME_NAME
```

- 应用（映射）数据卷

```bash
# 把数据卷和容器内部的路径做映射
docker run -v VOLUME_NAME:CONTAINER_INNER_PATH ...

# 把 HOST_PATH 和 CONTAINER_INNER_PATH 做映射
# 如果 HOST_PATH 不存在，docker 会为你创建
docker run -v HOST_PATH:CONTAINER_INNER_PATH ...
```
