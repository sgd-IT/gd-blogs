# 前端部署指南

## 部署步骤

### 1. 本地构建

```bash
cd blogs-frontend
npm install
npm run build
```

### 2. 上传到服务器的文件

使用 standalone 模式，需要上传：

```
blogs-frontend/
├── .next/
│   ├── standalone/          # 核心运行文件（必须）
│   └── static/              # 静态资源（必须）
├── public/                  # 公共资源（必须）
└── package.json             # 需要（用于运行）
```

### 3. 服务器上操作

```bash
# 进入前端目录
cd /www/wwwroot/gdblogs/blogs-frontend

# 创建环境变量文件
cat > .env.production << EOF
BACKEND_URL=http://119.91.150.19:8124
NEXT_PUBLIC_API_BASE_URL=/api
NEXT_PUBLIC_RESOURCE_BASE_URL=/uploads
EOF

# 启动服务（standalone 模式）
cd .next/standalone
node server.js

# 或使用 PM2 管理（推荐）
pm2 start server.js --name gdblogs-frontend --env production
pm2 save
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

## 注意事项

1. **环境变量**：确保服务器上设置了正确的 `BACKEND_URL` 和 `NEXT_PUBLIC_API_BASE_URL`
2. **端口**：Next.js 默认运行在 3000 端口，确保端口未被占用
3. **进程管理**：建议使用 PM2 管理进程，避免服务意外停止
4. **文件权限**：确保上传的文件有正确的读写权限
