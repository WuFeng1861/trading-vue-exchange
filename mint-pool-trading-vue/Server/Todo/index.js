
import mqBindAddressDao from "../Dao/mqBindAddress.js";
import mqEmailUserDao from "../Dao/mqEmailUser.js";

// 添加2个数据库 mq_bind_address 和 mq_email_user,检查这两个库是否存在并且有数据
const checkMqDb = async () => {
  // 检查 mq_bind_address 库是否存在
  let result = await mqBindAddressDao.query(0);
  console.log(result);
  if (!result) {
    throw new Error(`
    mq_bind_address 不存在,请执行
    CREATE TABLE \`mq_email_user\` (
  \`id\` bigint NOT NULL AUTO_INCREMENT COMMENT '主键id',
  \`user\` varchar(255) DEFAULT NULL COMMENT '用户名',
  \`pass\` varchar(255) DEFAULT NULL COMMENT '授权码',
  \`app\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '所属应用名字',
  \`email_company\` varchar(255) DEFAULT NULL COMMENT '邮箱所属公司 QQ|163|ali',
  \`limit_count\` int DEFAULT NULL COMMENT '限制每日发送的邮件数量',
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`);
  }
  // 检查 mq_email_user 库是否存在
  result = await mqEmailUserDao.getAppEmailUsers('Mercury', '163');
  if(!result || result.length === 0) {
    throw new Error(`mq_email_user 库中没有数据,或者mysql不存在这个库，请检查`);
  }
};
checkMqDb();
