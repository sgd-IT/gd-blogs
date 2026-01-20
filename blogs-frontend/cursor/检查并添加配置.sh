#!/bin/bash

echo "=== 检查 Nginx 配置 ==="

echo ""
echo "1. 检查重写规则文件："
cat /www/server/panel/vhost/rewrite/node_frontend.conf

echo ""
echo "2. 检查扩展配置文件（当前内容）："
cat /www/server/panel/vhost/nginx/extension/frontend/*.conf

echo ""
echo "=== 配置说明 ==="
echo "扩展配置文件几乎是空的，需要添加代理配置来禁用 HTML 缓存。"
echo ""
echo "请执行以下步骤："
echo "1. 备份配置：cp /www/server/panel/vhost/nginx/extension/frontend/*.conf /www/server/panel/vhost/nginx/extension/frontend/*.conf.bak"
echo "2. 编辑配置：vi /www/server/panel/vhost/nginx/extension/frontend/*.conf"
echo "3. 添加配置（见下方）"
echo "4. 测试：nginx -t"
echo "5. 重载：nginx -s reload"
