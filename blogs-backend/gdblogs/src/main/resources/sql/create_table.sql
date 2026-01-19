create database if not exists gd_blogs;
use gd_blogs;


-- 用户表
create table if not exists user
(
    id           bigint auto_increment comment 'id'
        primary key,
    userAccount  varchar(256)                           not null comment '账号',
    userPassword varchar(512)                           not null comment '密码',
    userName     varchar(256)                           null comment '用户昵称',
    userAvatar   varchar(1024)                          null comment '用户头像',
    userProfile  varchar(512)                           null comment '用户简介',
    userRole     varchar(256) default 'user'            not null comment '用户角色：user/admin',
    editTime     datetime     default CURRENT_TIMESTAMP not null comment '编辑时间',
    createTime   datetime     default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime   datetime     default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete     tinyint      default 0                 not null comment '是否删除',
    constraint uk_userAccount
        unique (userAccount)
)
    comment '用户' collate = utf8mb4_unicode_ci;

create index idx_userName
    on user (userName);


-- 文章表
create table if not exists post
(
    id           bigint auto_increment comment 'id' primary key,
    title        varchar(512)                       null comment '标题',
    content      mediumtext                         null comment '内容',
    tags         varchar(1024)                      null comment '标签列表（json 数组）',
    categoryId   bigint                             null comment '分类 id',
    coverImage   varchar(512)                       null comment '封面图片',
    summary      varchar(500)                       null comment '文章摘要',
    thumbNum     int      default 0                 not null comment '点赞数',
    favourNum    int      default 0                 not null comment '收藏数',
    userId       bigint                             not null comment '创建用户 id',
    isFeatured   tinyint  default 0                 not null comment '是否精选',
    externalLink varchar(512)                       null comment '外部链接',
    isHome       tinyint  default 0                 not null comment '是否展示在主页',
    createTime   datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime   datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete     tinyint  default 0                 not null comment '是否删除',
    index idx_userId (userId),
    index idx_categoryId (categoryId)
) comment '文章' collate = utf8mb4_unicode_ci;

-- 分类表
create table if not exists category
(
    id          bigint auto_increment comment 'id' primary key,
    name        varchar(128)                       not null comment '分类名称',
    description varchar(512)                       null comment '分类描述',
    sortOrder   int      default 0                 not null comment '排序',
    createTime  datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime  datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete    tinyint  default 0                 not null comment '是否删除',
    unique key uk_name (name)
) comment '分类' collate = utf8mb4_unicode_ci;

-- 评论表
create table if not exists comment
(
    id          bigint auto_increment comment 'id' primary key,
    content     text                               null comment '评论内容',
    postId      bigint                             not null comment '帖子id',
    userId      bigint                             not null comment '评论用户id',
    parentId    bigint                             null comment '父评论id（用于回复）',
    createTime  datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime  datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete    tinyint  default 0                 not null comment '是否删除',
    index idx_postId (postId),
    index idx_userId (userId)
) comment '评论' collate = utf8mb4_unicode_ci;

-- 通知表（站内通知）
create table if not exists notification
(
    id          bigint auto_increment comment 'id' primary key,
    type        varchar(32)                        not null comment '通知类型：comment/reply/thumb/favour/system',
    content     varchar(1024)                      not null comment '通知内容（展示文案）',
    receiverId  bigint                             not null comment '接收者用户 id',
    senderId    bigint                             not null comment '触发者用户 id',
    postId      bigint                             null comment '关联帖子 id',
    commentId   bigint                             null comment '关联评论 id',
    status      tinyint  default 0                 not null comment '状态：0未读/1已读',
    createTime  datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime  datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete    tinyint  default 0                 not null comment '是否删除',
    index idx_receiver_status_time (receiverId, status, createTime),
    index idx_receiver_time (receiverId, createTime)
) comment '通知' collate = utf8mb4_unicode_ci;

-- 初始数据
INSERT INTO category (name, description, sortOrder) VALUES ('Java', 'Java 相关技术文章', 1);
INSERT INTO category (name, description, sortOrder) VALUES ('Frontend', '前端开发技术', 2);
INSERT INTO category (name, description, sortOrder) VALUES ('Python', 'Python 编程与应用', 3);
INSERT INTO category (name, description, sortOrder) VALUES ('Algorithm', '算法与数据结构', 4);
INSERT INTO category (name, description, sortOrder) VALUES ('Other', '其他杂项', 5);

-- 初始管理员 (密码为 12345678 的 MD5: 25d55ad283aa400af464c76d713c07ad)
INSERT INTO user (userAccount, userPassword, userName, userRole, userProfile) VALUES ('admin', '25d55ad283aa400af464c76d713c07ad', 'Admin', 'admin', 'System Administrator'),
                                                                                     ('guest', '25d55ad283aa400af464c76d713c07ad', 'Guest', 'guest', '游客账号');
