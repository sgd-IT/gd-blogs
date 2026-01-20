# 添加 Nginx 配置 - 禁用 HTML 缓存

## 📋 当前状态

扩展配置文件 `/www/server/panel/vhost/nginx/extension/frontend/*.conf` 几乎是空的，只有日志配置。

这意味着代理配置可能在主配置文件或重写规则文件中。我们需要在扩展配置文件中添加禁用 HTML 缓存的配置。

## 🔍 先检查重写规则文件

```bash
cat /www/server/panel/vhost/rewrite/node_frontend.conf
```

## ✅ 添加配置步骤

### 步骤 1：备份现有配置

```bash
cp /www/server/panel/vhost/nginx/extension/frontend/*.conf /www/server/panel/vhost/nginx/extension/frontend/*.conf.bak
```

### 步骤 2：编辑配置文件

**方式 A：使用宝塔面板（推荐）**
1. 登录宝塔面板
2. 网站 → 找到 `frontend` 站点 → 设置
3. 配置修改 → 找到扩展配置文件
4. 添加以下配置

**方式 B：使用命令行**
```bash
vi /www/server/panel/vhost/nginx/extension/frontend/*.conf
```

### 步骤 3：添加以下配置

在文件末尾添加（保留原有的 `access_log` 行）：

```nginx
access_log syslog:server=unix:/tmp/site_total.sock,nohostname,tag=7__access site_total;

# 不缓存 HTML 页面
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # 禁用缓存 HTML
    proxy_cache_bypass $http_upgrade;
    proxy_no_cache $http_upgrade;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    add_header Expires "0";
}

# 只缓存静态资源（JS/CSS/图片）
location /_next/static/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_cache cache_one;
    proxy_cache_valid 200 30d;
    proxy_cache_key "$scheme$request_method$host$request_uri";
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

### 步骤 4：测试配置

```bash
# 测试 Nginx 配置是否正确
nginx -t
```

如果显示 `syntax is ok` 和 `test is successful`，说明配置正确。

### 步骤 5：重新加载 Nginx

```bash
nginx -s reload
```

### 步骤 6：验证

```bash
# 测试本地服务
curl -s http://localhost:3000 | grep -o "你好，我是"

# 测试公网访问（通过 Nginx）
curl -s http://119.91.150.19 | grep -o "你好，我是"
```

## 📝 完整配置文件示例

如果文件完全为空或只有一行，最终文件应该是：

```nginx
access_log syslog:server=unix:/tmp/site_total.sock,nohostname,tag=7__access site_total;

# 不缓存 HTML 页面
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # 禁用缓存 HTML
    proxy_cache_bypass $http_upgrade;
    proxy_no_cache $http_upgrade;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    add_header Expires "0";
}

# 只缓存静态资源（JS/CSS/图片）
location /_next/static/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_cache cache_one;
    proxy_cache_valid 200 30d;
    proxy_cache_key "$scheme$request_method$host$request_uri";
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

## ⚠️ 注意事项

1. **如果文件中已经有 `location /` 块**，需要修改现有的，而不是添加新的
2. **如果使用宝塔面板**，修改后会自动测试配置，如果出错会提示
3. **配置优先级**：扩展配置文件的 `location` 块会覆盖主配置文件的相同块

## 🎯 执行顺序

1. ✅ 先执行"立即清除缓存"（解决当前问题）
2. ✅ 然后添加这个配置（避免以后每次都要手动清除）
3. ✅ 清除浏览器缓存，访问验证
