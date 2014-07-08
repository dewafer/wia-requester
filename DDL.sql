CREATE TABLE `request` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `real_name` longtext,
  `weibo_nickname` longtext,
  `email_addr` longtext,
  `accepted` tinyint(1) DEFAULT '0',
  `rejected` tinyint(1) DEFAULT '0',
  `reject_reason` longtext,
  `insert_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

