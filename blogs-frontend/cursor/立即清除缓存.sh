#!/bin/bash

echo "=== 清除 Nginx 代理缓存 ==="

# 1. 清除缓存目录
echo "正在清除缓存目录..."
rm -rf /www/server/nginx/proxy_cache_dir/*
mkdir -p /www/server/nginx/proxy_cache_dir

# 2. 重新加载 Nginx
echo "正在重新加载 Nginx..."
nginx -s reload 2>/dev/null || systemctl reload nginx 2>/dev/null || /etc/init.d/nginx reload

# 3. 验证缓存目录
echo "验证缓存目录（应该为空）..."
ls -la /www/server/nginx/proxy_cache_dir/ | head -5

# 4. 测试本地服务
echo ""
echo "测试本地服务（应该显示：你好，我是）..."
curl -s http://localhost:3000 | grep -o "你好，我是" | head -1

echo ""
echo "=== 完成 ==="
echo "✅ Nginx 缓存已清除"
echo "📝 接下来请："
echo "   1. 清除浏览器缓存（Ctrl+Shift+Delete）"
echo "   2. 或使用无痕模式访问：http://119.91.150.19"
echo "   3. 或硬刷新：Ctrl+Shift+R"
