# 清除 Nginx 代理缓存 - 解决浏览器显示旧版本问题

## 🔍 问题确认

根据检查结果，发现：
- ✅ Nginx 启用了代理缓存：`proxy_cache cache_one;`
- ✅ 缓存路径：`/www/server/nginx/proxy_cache_dir`
- ✅ 缓存过期时间：`inactive=1d`（1天不活跃后过期）

**这就是为什么浏览器显示旧版本的根本原因！**

## 🚀 立即解决方案

### 步骤 1：检查扩展配置文件（确认是否启用了代理缓存）

```bash
# 查看扩展配置
cat /www/server/panel/vhost/nginx/extension/frontend/*.conf

# 查看 Node.js 重写配置
cat /www/server/panel/vhost/rewrite/node_frontend.conf
```

### 步骤 2：清除 Nginx 代理缓存（关键！）

```bash
# 清除代理缓存目录
rm -rf /www/server/nginx/proxy_cache_dir/*

# 如果缓存目录不存在，创建它（避免错误）
mkdir -p /www/server/nginx/proxy_cache_dir

# 重新加载 Nginx（不中断服务）
nginx -s reload

# 或者重启 Nginx（如果 reload 不行）
systemctl reload nginx
# 或者
/etc/init.d/nginx reload
```

### 步骤 3：验证缓存已清除

```bash
# 检查缓存目录是否为空
ls -la /www/server/nginx/proxy_cache_dir/

# 应该显示为空或只有目录本身
```

### 步骤 4：测试访问

```bash
# 测试本地服务（应该返回新版本）
curl -s http://localhost:3000 | grep -o "你好，我是" | head -1

# 测试公网访问（通过 Nginx）
curl -s http://119.91.150.19 | grep -o "你好，我是" | head -1
```

### 步骤 5：清除浏览器缓存

即使清除了 Nginx 缓存，浏览器可能还有缓存：

1. **硬刷新**：`Ctrl + Shift + R` 或 `Ctrl + F5`
2. **无痕模式**：`Ctrl + Shift + N`（Chrome）或 `Ctrl + Shift + P`（Firefox）
3. **开发者工具**：
   - 按 `F12`
   - Network 标签 → 勾选 "Disable cache"
   - 刷新页面

## 🔧 长期解决方案（可选）

### 方案 A：禁用 HTML 页面的代理缓存（推荐）

修改 Nginx 扩展配置文件，只缓存静态资源，不缓存 HTML：

```nginx
# 在 /www/server/panel/vhost/nginx/extension/frontend/*.conf 中添加：

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

### 方案 B：完全禁用代理缓存（简单但不推荐）

如果不需要缓存，可以完全禁用：

```nginx
# 在配置文件中移除或注释掉：
# proxy_cache cache_one;
```

## 📋 一键清除脚本

```bash
#!/bin/bash

echo "=== 清除 Nginx 代理缓存 ==="

# 1. 清除缓存目录
echo "清除缓存目录..."
rm -rf /www/server/nginx/proxy_cache_dir/*
mkdir -p /www/server/nginx/proxy_cache_dir

# 2. 重新加载 Nginx
echo "重新加载 Nginx..."
nginx -s reload 2>/dev/null || systemctl reload nginx 2>/dev/null || /etc/init.d/nginx reload

# 3. 验证
echo "验证缓存目录..."
ls -la /www/server/nginx/proxy_cache_dir/

# 4. 测试
echo "测试本地服务..."
curl -s http://localhost:3000 | grep -o "你好，我是" | head -1

echo "=== 完成 ==="
echo "请清除浏览器缓存后访问：http://119.91.150.19"
```

## ⚠️ 注意事项

1. **清除缓存后必须重新加载 Nginx**，否则缓存不会生效
2. **浏览器缓存也需要清除**，否则浏览器可能还显示旧版本
3. **建议使用方案 A**（只缓存静态资源），既保证 HTML 更新及时，又提升静态资源加载速度
4. **如果修改了 Nginx 配置**，记得备份原配置：
   ```bash
   cp /www/server/panel/vhost/nginx/extension/frontend/*.conf /www/server/panel/vhost/nginx/extension/frontend/*.conf.bak
   ```

## 🎯 执行顺序

1. ✅ 先执行"步骤 2"清除 Nginx 缓存
2. ✅ 然后清除浏览器缓存
3. ✅ 访问 `http://119.91.150.19` 验证
4. ✅ 如果还有问题，执行"步骤 1"检查配置，然后考虑"长期解决方案"
