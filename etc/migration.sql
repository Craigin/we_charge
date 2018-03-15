/* 违规用户 2017/11/03 discovery */
AlTER TABLE tbl_violation CHANGE COLUMN `create_user` `create_user_id` bigint(20) DEFAULT NULL;
AlTER TABLE tbl_violation CHANGE COLUMN `update_user` `update_user_id` bigint(20) DEFAULT NULL;

/* task 2017/11/30 discovery_admin */
ALTER TABLE tbl_task ADD `payload` text COMMENT '附加数据';
ALTER TABLE tbl_mail_template ADD `image` text COMMENT '缩略图url';

/* task 2017/12/11 discovery_admin */
ALTER TABLE tbl_mail_template ADD `mailData` text COMMENT '邮件参数';
ALTER TABLE tbl_mail_template ADD `isMailList` varchar(50) DEFAULT '' COMMENT '相同邮件正文';