CREATE TABLE `tbl_supervisor` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `type` tinyint(4) NOT NULL DEFAULT '1' COMMENT '1:超级管理员 2:普通管理员',
  `roles` text NOT NULL COMMENT '角色，用逗号分开',
  `status` tinyint(3) unsigned NOT NULL DEFAULT '1',
  `create_user_id` bigint(20) NOT NULL COMMENT '创建用户id',
  `update_user_id` bigint(20) NOT NULL COMMENT '更新用户id',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`)
);

CREATE TABLE `tbl_supervisor_history` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `supervisor_id` int(11) unsigned NOT NULL COMMENT '管理员id',
  `type` varchar(16) NOT NULL COMMENT '类型',
  `operation` varchar(64) NOT NULL COMMENT '操作',
  `target` text NOT NULL COMMENT '目标',
  `params` text NOT NULL COMMENT '参数',
  `payload` text NOT NULL COMMENT '其他数据',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
);

/*************/

/* 首页横幅 */
CREATE TABLE `tbl_banner` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `title` varchar(128) NOT NULL COMMENT '标题',
  `image` text NOT NULL COMMENT '图片url',
  `url` text NOT NULL COMMENT '跳转url',
  `index` int(10) NOT NULL COMMENT '排序',
  `show` tinyint(1) NOT NULL COMMENT '0:隐藏|1:展示',
  `payload` text NOT NULL COMMENT '附加数据',
  `create_user_id` bigint(20) NOT NULL COMMENT '创建用户id',
  `update_user_id` bigint(20) NOT NULL COMMENT '更新用户id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='首页横幅表';

CREATE TABLE `tbl_banner_lang` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `banner_id` bigint(20) NOT NULL COMMENT '横幅id',
  `lang` varchar(8) NOT NULL COMMENT '语言, zh|en|ru...',
  `title` varchar(128) NOT NULL COMMENT '标题',
  `image` text NOT NULL COMMENT '图片url',
  `url` text NOT NULL COMMENT '跳转url',
  `payload` text NOT NULL COMMENT '附加数据',
  `create_user_id` bigint(20) NOT NULL COMMENT '创建用户id',
  `update_user_id` bigint(20) NOT NULL COMMENT '更新用户id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_tbl_banner_lang_banner_lang` (`banner_id`, `lang`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='首页横幅表多语言表';

/* 数据广场 */
CREATE TABLE `tbl_square_tag` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `type` varchar(16) NOT NULL COMMENT '类型, location|industry|year|other',
  `title` varchar(128) NOT NULL COMMENT '标题',
  `index` int(10) NOT NULL COMMENT '排序',
  `show` tinyint(1) NOT NULL COMMENT '0:隐藏|1:展示',
  `payload` text NOT NULL COMMENT '附加数据',
  `create_user_id` bigint(20) NOT NULL COMMENT '创建用户id',
  `update_user_id` bigint(20) NOT NULL COMMENT '更新用户id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_tbl_square_tag_type_title` (`type`, `title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='数据广场标签表';

CREATE TABLE `tbl_square_tag_lang` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `tag_id` bigint(20) NOT NULL COMMENT '标签id',
  `lang` varchar(8) NOT NULL COMMENT '语言, zh|en|ru...',
  `title` varchar(128) NOT NULL COMMENT '标题',
  `payload` text NOT NULL COMMENT '附加数据',
  `create_user_id` bigint(20) NOT NULL COMMENT '创建用户id',
  `update_user_id` bigint(20) NOT NULL COMMENT '更新用户id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_tbl_square_tag_lang_tag_lang` (`tag_id`, `lang`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='数据广场标签多语言表';

CREATE TABLE `tbl_square_directory` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `title` varchar(128) NOT NULL COMMENT '标题',
  `image` text NOT NULL COMMENT '图片url',
  `description` text NOT NULL COMMENT '详细描述',
  `price` int(10) NOT NULL COMMENT '排序',
  `free_view` int(10) NOT NULL COMMENT '免费查看数量',
  `heat` int(10) NOT NULL COMMENT '热度',
  `index` int(10) NOT NULL COMMENT '排序',
  `show` tinyint(1) NOT NULL COMMENT '0:隐藏|1:展示',
  `payload` text NOT NULL COMMENT '附加数据',
  `create_user_id` bigint(20) NOT NULL COMMENT '创建用户id',
  `update_user_id` bigint(20) NOT NULL COMMENT '更新用户id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='数据广场目录表';

CREATE TABLE `tbl_square_directory_lang` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `directory_id` bigint(20) NOT NULL COMMENT '名录id',
  `lang` varchar(8) NOT NULL COMMENT '语言, zh|en|ru...',
  `title` varchar(128) NOT NULL COMMENT '标题',
  `image` text NOT NULL COMMENT '图片url',
  `description` text NOT NULL COMMENT '详细描述',
  `payload` text NOT NULL COMMENT '附加数据',
  `create_user_id` bigint(20) NOT NULL COMMENT '创建用户id',
  `update_user_id` bigint(20) NOT NULL COMMENT '更新用户id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_tbl_square_directory_lang_directory_lang` (`directory_id`, `lang`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='数据广场目录多语言表';

CREATE TABLE `tbl_square_directory_tag` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `directory_id` bigint(20) NOT NULL COMMENT '名录id',
  `tag_id` bigint(20) NOT NULL COMMENT '标签id',
  `index` int(10) NOT NULL COMMENT '排序',
  `create_user_id` bigint(20) NOT NULL COMMENT '创建用户id',
  `update_user_id` bigint(20) NOT NULL COMMENT '更新用户id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_tbl_square_directory_tag_directory_tag` (`directory_id`, `tag_id`),
  KEY `index_tbl_square_directory_tag_directory_index` (`directory_id`, `index`),
  KEY `index_tbl_square_directory_tag_tag` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='数据广场目录多语言表';

CREATE TABLE `tbl_square_directory_company` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `directory_id` bigint(20) NOT NULL COMMENT '名录id',
  `company_hash_id` varchar(64) NOT NULL COMMENT '公司id',
  `index` int(10) NOT NULL COMMENT '排序',
  `show` tinyint(1) NOT NULL COMMENT '0:隐藏|1:展示',
  `payload` text NOT NULL COMMENT '附加数据',
  `create_user_id` bigint(20) NOT NULL COMMENT '创建用户id',
  `update_user_id` bigint(20) NOT NULL COMMENT '更新用户id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_tbl_square_directory_company_directory_company` (`directory_id`, `company_hash_id`),
  KEY `index_tbl_square_directory_company_company` (`company_hash_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='数据广场目录公司表';

CREATE TABLE `tbl_square_directory_company_lang` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `directory_company_id` bigint(20) NOT NULL COMMENT '名录id',
  `lang` varchar(8) NOT NULL COMMENT '语言, zh|en|ru...',
  `payload` text NOT NULL COMMENT '附加数据',
  `create_user_id` bigint(20) NOT NULL COMMENT '创建用户id',
  `update_user_id` bigint(20) NOT NULL COMMENT '更新用户id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_tbl_square_directory_lang_directory_company_lang` (`directory_company_id`, `lang`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='数据广场目录公司多语言表';

/* 数据订正 */
CREATE TABLE `tbl_revise_company` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `company_hash_id` varchar(64) NOT NULL COMMENT '公司id',
  `enable` tinyint(1) NOT NULL COMMENT '0:不生效|1:生效',
  `create_user_id` bigint(20) NOT NULL COMMENT '创建用户id',
  `update_user_id` bigint(20) NOT NULL COMMENT '更新用户id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_tbl_revise_company_company` (`company_hash_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='数据订正公司表';

CREATE TABLE `tbl_revise_company_field` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `revise_company_id` varchar(64) NOT NULL COMMENT '数据订正公司id',
  `field` varchar(64) NOT NULL COMMENT '字段名称',
  `from` text NOT NULL COMMENT '原始数据',
  `to` text NOT NULL COMMENT '订正数据',
  `enable` tinyint(1) NOT NULL COMMENT '0:不生效|1:生效',
  `create_user_id` bigint(20) NOT NULL COMMENT '创建用户id',
  `update_user_id` bigint(20) NOT NULL COMMENT '更新用户id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_tbl_revise_company_company_field` (`revise_company_id`, `field`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='数据订正公司字段表';

CREATE TABLE `tbl_revise_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `type` varchar(16) NOT NULL COMMENT '类型, company:公司',
  `total` bigint(20) NOT NULL COMMENT '全部订正数量',
  `revised` bigint(20) NOT NULL COMMENT '发生订正数量',
  `errors` bigint(20) NOT NULL COMMENT '错误数量',
  `notify` tinyint(1) NOT NULL COMMENT '0:忽略|1:通告',
  `payload` text NOT NULL COMMENT '附加数据',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='数据订正日志表';

/* 统计报表 */
CREATE TABLE `tbl_operate_report` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` varchar(128) NOT NULL COMMENT '报表页名称',
  `index` int(10) NOT NULL COMMENT '排序',
  `create_user_id` bigint(20) NOT NULL COMMENT '创建用户id',
  `update_user_id` bigint(20) NOT NULL COMMENT '更新用户id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='报表页';

CREATE TABLE `tbl_operate_report_group` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `report_id` bigint(20) NOT NULL COMMENT '报表页id',
  `name` varchar(128) NOT NULL COMMENT '报表名称',
  `index` int(10) NOT NULL COMMENT '排序',
  `payload` text NOT NULL COMMENT '附加数据',
  `create_user_id` bigint(20) NOT NULL COMMENT '创建用户id',
  `update_user_id` bigint(20) NOT NULL COMMENT '更新用户id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='报表';

CREATE TABLE `tbl_operate_report_field` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `group_id` bigint(20) NOT NULL COMMENT '报表id',
  `name` varchar(128) NOT NULL COMMENT '字段名称',
  `index` int(10) NOT NULL COMMENT '排序',
  `create_user_id` bigint(20) NOT NULL COMMENT '创建用户id',
  `update_user_id` bigint(20) NOT NULL COMMENT '更新用户id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='报表字段';

CREATE TABLE `tbl_operate_report_field_cell` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `field_id` bigint(20) NOT NULL COMMENT '字段id',
  `name` varchar(128) NOT NULL COMMENT '字段名称',
  `aspect` varchar(16) NOT NULL COMMENT 'common | client | user | all，common意味着可以被复用',
  `type` varchar(16) NOT NULL COMMENT 'sql | raw | mysql | virtual | hidden',
  `source` varchar(64) NOT NULL COMMENT '数据源名称',
  `sentence` text NOT NULL COMMENT 'SQL语句或者JSON',
  `extract` text NOT NULL COMMENT '数据提取方式',
  `render` varchar(32) NOT NULL COMMENT 'number | percentage',
  `create_user_id` bigint(20) NOT NULL COMMENT '创建用户id',
  `update_user_id` bigint(20) NOT NULL COMMENT '更新用户id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='报表字段cell';

/* 订阅 */
CREATE TABLE `tbl_subscribe_channel` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `title` varchar(128) NOT NULL COMMENT '标题',
  `image` text NOT NULL COMMENT '图片url',
  `description` text NOT NULL COMMENT '详细描述',
  `key` varchar(32) NOT NULL COMMENT '唯一标记',
  `name` varchar(32) DEFAULT NULL COMMENT '名称',
  `type` varchar(32) NOT NULL COMMENT '类型',
  `expand` tinyint(1) NOT NULL COMMENT '0:收起|1:展开',
  `parent_id` bigint(20) NOT NULL COMMENT '父级频道id',
  `index` int(10) NOT NULL COMMENT '排序',
  `show` tinyint(1) NOT NULL COMMENT '0:隐藏|1:展示',
  `promote_time` datetime NOT NULL COMMENT '推广时间',
  `payload` text NOT NULL COMMENT '附加数据',
  `create_user_id` bigint(20) NOT NULL COMMENT '创建用户id',
  `update_user_id` bigint(20) NOT NULL COMMENT '更新用户id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `index_tbl_subscribe_channel_key` (`key`),
  KEY `index_tbl_subscribe_channel_parent` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订阅频道';

CREATE TABLE `tbl_subscribe_channel_lang` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `subscribe_channel_id` bigint(20) NOT NULL COMMENT '频道id',
  `lang` varchar(8) NOT NULL COMMENT '语言, zh|en|ru...',
  `title` varchar(128) NOT NULL COMMENT '标题',
  `image` text NOT NULL COMMENT '图片url',
  `description` text NOT NULL COMMENT '详细描述',
  `payload` text NOT NULL COMMENT '附加数据',
  `create_user_id` bigint(20) NOT NULL COMMENT '创建用户id',
  `update_user_id` bigint(20) NOT NULL COMMENT '更新用户id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_tbl_subscribe_channel_lang_subscribe_channel_lang` (`subscribe_channel_id`, `lang`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订阅频道多语言表';

/* 运营活动 */
CREATE TABLE `tbl_activity` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` varchar(128) NOT NULL COMMENT '名称',
  `type` varchar(16) NOT NULL COMMENT '类型, lottery|rank',
  `client_id` bigint(20) NOT NULL COMMENT 'client_id',
  `title` varchar(128) NOT NULL COMMENT '标题',
  `description` text NOT NULL COMMENT '详细描述',
  `max` int(10) NOT NULL COMMENT '最高抽奖次数',
  `domain` varchar(128) NOT NULL COMMENT '抽奖时间分隔域',
  `payload` text NOT NULL COMMENT '附加数据',
  `start_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '开始时间',
  `end_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '结束时间',
  `create_user_id` bigint(20) NOT NULL COMMENT '创建用户id',
  `update_user_id` bigint(20) NOT NULL COMMENT '更新用户id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='活动';

CREATE TABLE `tbl_activity_event` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `activity_id` bigint(20) NOT NULL COMMENT 'activity_id',
  `name` varchar(128) NOT NULL COMMENT '名称',
  `value` int(10) NOT NULL COMMENT '计数',
  `create_user_id` bigint(20) NOT NULL COMMENT '创建用户id',
  `update_user_id` bigint(20) NOT NULL COMMENT '更新用户id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='活动事件';

CREATE TABLE `tbl_activity_reward` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `activity_id` bigint(20) NOT NULL COMMENT 'activity_id',
  `index` int(10) NOT NULL COMMENT '序号',
  `title` varchar(128) NOT NULL COMMENT '标题',
  `description` text NOT NULL COMMENT '详细描述',
  `max` int(10) NOT NULL COMMENT '该奖品最多获得次数',
  `type` varchar(16) NOT NULL COMMENT '类型, credit|other',
  `value` int(10) NOT NULL COMMENT '计数',
  `rate` float NULL COMMENT '抽奖率',
  `total` float NULL COMMENT '奖品总数',
  `rank_start` int(10) NOT NULL COMMENT '奖品排行起始',
  `rank_end` int(10) NOT NULL  COMMENT '奖品排行截止',
  `create_user_id` bigint(20) NOT NULL COMMENT '创建用户id',
  `update_user_id` bigint(20) NOT NULL COMMENT '更新用户id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='活动奖励';

CREATE TABLE `tbl_user_event` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `client_type` tinyint(4) NOT NULL COMMENT '做内部用户和外部用户的分割',
  `client_id` bigint(20) NOT NULL COMMENT 'client_id',
  `user_id` bigint(20) NOT NULL COMMENT 'user_id',
  `name` varchar(128) NOT NULL COMMENT '标题',
  `value` int(10) NOT NULL COMMENT '计数',
  `activities` varchar(128) NOT NULL COMMENT '命中的运营活动id号列表',
  `payload` text NOT NULL COMMENT '附加数据',
  `create_user_id` bigint(20) NOT NULL COMMENT '创建用户id',
  `update_user_id` bigint(20) NOT NULL COMMENT '更新用户id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户事件';

CREATE TABLE `tbl_activity_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `activity_id` bigint(20) NOT NULL COMMENT 'activity_id',
  `client_type` tinyint(4) NOT NULL COMMENT '做内部用户和外部用户的分割',
  `client_id` bigint(20) NOT NULL COMMENT 'client_id',
  `user_id` bigint(20) NOT NULL COMMENT 'user_id',
  `domain` varchar(128) NOT NULL COMMENT '抽奖时间分隔域',
  `value` int(10) NOT NULL COMMENT '计数',
  `used` int(10) NOT NULL COMMENT '表示已经使用的抽奖次数',
  `blocked` tinyint(1) NOT NULL COMMENT '0:unblocked|1:blocked',
  `create_user_id` bigint(20) NOT NULL COMMENT '创建用户id',
  `update_user_id` bigint(20) NOT NULL COMMENT '更新用户id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='活动用户';

CREATE TABLE `tbl_activity_user_reward` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `activity_id` bigint(20) NOT NULL COMMENT 'activity_id',
  `client_type` tinyint(4) NOT NULL COMMENT '做内部用户和外部用户的分割',
  `client_id` bigint(20) NOT NULL COMMENT 'client_id',
  `user_id` bigint(20) NOT NULL COMMENT 'user_id',
  `domain` varchar(128) NOT NULL COMMENT '抽奖时间分隔域',
  `activity_reward_id` bigint(20) NOT NULL COMMENT 'activity_reward_id',
  `rank` int(10) NOT NULL default 0 COMMENT '榜单名次',
  `granted` tinyint(1) NOT NULL default 0 COMMENT '0:未发放|1:已经发放',
  `create_user_id` bigint(20) NOT NULL COMMENT '创建用户id',
  `update_user_id` bigint(20) NOT NULL COMMENT '更新用户id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='活动用户奖励';

/* 产品更新日志 */
CREATE TABLE `tbl_release_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `title` varchar(128) NOT NULL COMMENT '标题',
  `description` text NOT NULL COMMENT '详细描述',
  `index` int(10) NOT NULL COMMENT '排序',
  `release_date` datetime NOT NULL COMMENT '发布日期',
  `tag` varchar(128) NOT NULL COMMENT '分组标签',
  `create_user_id` bigint(20) NOT NULL COMMENT '创建用户id',
  `update_user_id` bigint(20) NOT NULL COMMENT '更新用户id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='产品更新日志';

CREATE TABLE `tbl_product_guide` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `title` varchar(128) NOT NULL COMMENT '标题',
  `description` text NOT NULL COMMENT '详细描述',
  `index` int(10) NOT NULL COMMENT '排序',
  `image` text NOT NULL COMMENT '图片url',
  `url` text NOT NULL COMMENT '跳转url',
  `payload` text NOT NULL COMMENT '其他数据',
  `create_user_id` bigint(20) NOT NULL COMMENT '创建用户id',
  `update_user_id` bigint(20) NOT NULL COMMENT '更新用户id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='产品更新功能指南';

/* 日志输出 */
CREATE TABLE `tbl_log_tail` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `title` varchar(128) NOT NULL COMMENT '标题',
  `description` text NOT NULL COMMENT '详细描述',
  `filename` text NOT NULL COMMENT '文件名称',
  `count` int(10) NOT NULL COMMENT '行数',
  `ssh` text NOT NULL COMMENT 'ssh',
  `roles` text NOT NULL COMMENT 'roles',
  `create_user_id` bigint(20) NOT NULL COMMENT '创建用户id',
  `update_user_id` bigint(20) NOT NULL COMMENT '更新用户id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='输出日志';

CREATE TABLE `tbl_mail_template` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '模板ID',
  `keyname` varchar(100) NOT NULL COMMENT '模板keyname',
  `title` varchar(128) NOT NULL COMMENT '标题',
  `data` text NOT NULL COMMENT '模板内容',
  `create_user_id` bigint(20) NOT NULL COMMENT '创建用户id',
  `update_user_id` bigint(20) NOT NULL COMMENT '更新用户id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_tbl_mail_template_keyname` (`keyname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='邮件模板表';

/* 任务表 */
CREATE TABLE `tbl_task` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` varchar(100) NOT NULL DEFAULT '' COMMENT '任务名称',
  `type` varchar(100) NOT NULL DEFAULT '' COMMENT '任务类型',
  `url` text NOT NULL COMMENT '任务建立URL',
  `status` int(10) NOT NULL COMMENT '0:未开始|1:进行中|2:已完成|3:中断',
  `num` int(20) NOT NULL COMMENT '任务数量',
  `complete_num` int(10) NOT NULL COMMENT '完成数量',
  `success_num` int(10) NOT NULL COMMENT '成功数量',
  `fail_num` int(10) NOT NULL COMMENT '失败数量',
  `create_user_id` bigint(20) NOT NULL COMMENT '创建用户id',
  `update_user_id` bigint(20) NOT NULL COMMENT '更新用户id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8 COMMENT='任务表';

CREATE TABLE `tbl_task_item` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'id',
  `task_id` bigint(20) NOT NULL COMMENT '进程ID',
  `name` varchar(100) NOT NULL DEFAULT '' COMMENT '名称',
  `status` int(10) DEFAULT NULL COMMENT '0:未开始|1:成功|2:失败',
  `create_user_id` bigint(20) NOT NULL COMMENT '创建用户id',
  `update_user_id` bigint(20) NOT NULL COMMENT '更新用户id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='任务进程表';

CREATE TABLE `tbl_square_industry_tag` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `report_id` varchar(50) NOT NULL COMMENT '行业报告id',
  `tag_id` bigint(20) NOT NULL COMMENT '标签id',
  `index` int(10) NOT NULL COMMENT '排序',
  `create_user_id` bigint(20) NOT NULL COMMENT '创建用户id',
  `update_user_id` bigint(20) NOT NULL COMMENT '更新用户id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `index_tbl_square_indsutry_tag_industry_index` (`report_id`,`index`),
  KEY `index_tbl_square_industry_tag_tag` (`tag_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COMMENT='数据广场行业报告标签表';

CREATE TABLE `tbl_follow_group_lang` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `group_id` bigint(20) NOT NULL COMMENT '标签id',
  `lang` varchar(8) NOT NULL COMMENT '语言, zh|en|ru...',
  `title` varchar(128) NOT NULL COMMENT '标题',
  `payload` text NOT NULL COMMENT '附加数据',
  `create_user_id` bigint(20) NOT NULL COMMENT '创建用户id',
  `update_user_id` bigint(20) NOT NULL COMMENT '更新用户id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_tbl_follow_group_lang_group_lang` (`group_id`, `lang`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='关注分组表多语言表';

CREATE TABLE `tbl_feedback` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `client_id` bigint(20) NOT NULL COMMENT '公司id',
  `user_id` bigint(20) NOT NULL COMMENT '用户id',
  `type` varchar(255) NOT NULL COMMENT '模块名',
  `company_hash_id` varchar(255) NOT NULL COMMENT '公司id',
  `content` varchar(255) NOT NULL COMMENT '内容',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37402 DEFAULT CHARSET=utf8mb4 COMMENT='反馈记录标'
