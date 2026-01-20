# 修复 PM2 Node.js 版本不匹配问题

## 问题分析
- 当前 Node.js 版本：v20.20.0
- PM2 安装时的 Node.js 版本：v20.18.3
- 错误：找不到 PM2 模块文件

## 解决方案

### 方案一：重新安装 PM2（推荐）

```bash
# 1. 删除旧的 PM2 进程
pm2 delete all

# 2. 重新安装 PM2（使用当前 Node.js 版本）
npm install -g pm2

# 3. 或者如果使用宝塔面板，可能需要：
# 在宝塔面板中重新安装 PM2，或使用正确的 Node.js 版本管理器
```

### 方案二：使用正确的 Node.js 版本

```bash
# 切换到 PM2 安装时的 Node.js 版本
nvm use 20.18.3
# 或
source /www/server/nodejs/v20.18.3/bin/npm

# 然后重新启动
pm2 restart gdblogs-frontend
```

### 方案三：直接运行（临时方案）

如果 PM2 问题暂时无法解决，可以直接运行：

```bash
cd /www/wwwroot/gdblogs/blogs-frontend

# 直接运行（前台运行）
npm run start

# 或者后台运行
nohup npm run start > /tmp/frontend.log 2>&1 &
```

### 方案四：使用 systemd 服务（推荐用于生产环境）

创建 systemd 服务文件：

```bash
sudo nano /etc/systemd/system/gdblogs-frontend.service
```

内容：
```ini
[Unit]
Description=Gdblogs Frontend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/www/wwwroot/gdblogs/blogs-frontend
ExecStart=/www/server/nodejs/v20.20.0/bin/npm run start
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

然后：
```bash
sudo systemctl daemon-reload
sudo systemctl enable gdblogs-frontend
sudo systemctl start gdblogs-frontend
sudo systemctl status gdblogs-frontend
```

## 快速解决（推荐先试这个）

```bash
# 1. 删除所有 PM2 进程
pm2 delete all

# 2. 重新安装 PM2
npm install -g pm2

# 3. 重新启动服务
cd /www/wwwroot/gdblogs/blogs-frontend
pm2 start npm --name gdblogs-frontend -- start
pm2 save

# 4. 检查状态
pm2 list
pm2 logs gdblogs-frontend
```

## 如果使用宝塔面板

1. 进入宝塔面板 → 软件商店 → PM2 管理器
2. 重新安装或更新 PM2
3. 确保 PM2 使用的 Node.js 版本与当前系统版本一致
