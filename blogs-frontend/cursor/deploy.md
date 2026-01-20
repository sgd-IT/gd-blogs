# 前端部署指南

## 部署步骤（普通模式）

### 1. 本地构建

```bash
cd blogs-frontend
npm install
npm run build
```

### 2. 上传到服务器的文件

需要上传以下文件：

```
blogs-frontend/
├── .next/                   # 构建输出目录（必须）
│   ├── static/              # 静态资源
│   └── server/              # 服务器文件
├── public/                  # 公共资源（必须）
├── package.json             # 需要（用于运行）
├── node_modules/            # 依赖包（必须）
└── .env.production          # 环境变量文件（可选）
```

**或者上传整个项目目录**，然后在服务器上执行 `npm install` 和 `npm run build`

### 3. 服务器上操作

```bash
# 进入前端目录
cd /www/wwwroot/gdblogs/blogs-frontend

# 如果上传的是源码，需要安装依赖和构建
npm install
npm run build

# 创建环境变量文件（如果还没有）
cat > .env.production << EOF
BACKEND_URL=http://119.91.150.19:8124
NEXT_PUBLIC_API_BASE_URL=/api
NEXT_PUBLIC_RESOURCE_BASE_URL=/uploads
EOF

# 启动服务
npm run start

# 或使用 PM2 管理（推荐）
pm2 start npm --name gdblogs-frontend -- start
# 或者
pm2 start "npm run start" --name gdblogs-frontend
pm2 save
```

### 4. 更新部署（重要！）

**每次更新代码后，必须执行以下步骤：**

```bash
# 1. 停止旧服务
pm2 stop gdblogs-frontend
# 或者如果直接运行：Ctrl+C 停止进程

# 2. 进入项目目录
cd /www/wwwroot/gdblogs/blogs-frontend

# 3. 拉取最新代码（如果使用 git）
git pull

# 4. 安装新依赖（如果有更新）
npm install

# 5. 重新构建（必须！）
npm run build

# 6. 重启服务
pm2 restart gdblogs-frontend
# 或者
pm2 start npm --name gdblogs-frontend -- start
```

### 4. Nginx 配置（如果需要）

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API 请求转发到后端
    location /api {
        rewrite ^/api/(.*)$ /$1 break;
        proxy_pass http://localhost:8124;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 上传图片静态资源（/uploads）
    location /uploads {
        alias /www/wwwroot/gdblogs/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

## 快速验证部署是否成功

部署后，可以通过以下命令快速验证：

```bash
# 在服务器上运行检查脚本（如果已上传）
bash cursor/deploy-check.sh

# 或手动检查关键文件
# 1. 检查组件文件是否包含中文内容
grep "你好，我是" src/components/desktop/OrbitingIntroduction.tsx

# 2. 检查构建时间
ls -lh .next/

# 3. 检查服务是否运行
pm2 list | grep gdblogs-frontend

# 4. 检查端口
netstat -tuln | grep 3000
```

## 排查问题：更新后还是显示旧版本

如果上传新代码后，访问网站还是显示旧版本，请按以下步骤排查：

### 1. 检查是否重新构建
```bash
# 确认 .next 目录的修改时间
ls -la .next/

# 如果时间不对，需要重新构建
npm run build
```

### 2. 检查服务是否重启
```bash
# 查看 PM2 进程状态
pm2 list
pm2 logs gdblogs-frontend

# 重启服务
pm2 restart gdblogs-frontend

# 或者如果直接运行，需要先停止再启动
# Ctrl+C 停止，然后 npm run start
```

### 3. 清除浏览器缓存
- 按 `Ctrl + Shift + Delete` 清除浏览器缓存
- 或者使用无痕模式访问
- 或者按 `Ctrl + F5` 强制刷新

### 4. 检查 Nginx 缓存（如果有）
```bash
# 清除 Nginx 缓存
sudo rm -rf /var/cache/nginx/*
sudo nginx -s reload
```

### 5. 检查文件是否正确上传
```bash
# 检查关键文件的修改时间
ls -la src/app/page.tsx
ls -la .next/BUILD_ID

# 确认文件确实更新了

# 验证组件内容是否为中文版本（重要！）
grep -n "你好，我是" src/components/desktop/OrbitingIntroduction.tsx
# 如果输出为空，说明文件是旧版本，需要重新上传

# 或者检查构建后的文件
grep -r "你好，我是" .next/static/ 2>/dev/null | head -5
# 如果找不到，说明构建的是旧代码
```

### 6. 查看服务日志
```bash
# PM2 日志
pm2 logs gdblogs-frontend --lines 50

# 或者直接运行的日志
# 查看终端输出
```

## 注意事项

1. **环境变量**：确保服务器上设置了正确的 `BACKEND_URL` 和 `NEXT_PUBLIC_API_BASE_URL`
2. **端口**：Next.js 默认运行在 3000 端口，确保端口未被占用
3. **进程管理**：建议使用 PM2 管理进程，避免服务意外停止
4. **文件权限**：确保上传的文件有正确的读写权限
5. **重要**：每次更新代码后，**必须重新构建（npm run build）并重启服务**，否则不会生效
