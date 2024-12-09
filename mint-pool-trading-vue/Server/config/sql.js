export const config = {
  "username": "root",
  "password": "666666",
  "database": "mint",
  "host": "127.0.0.1",
  "dialect": "mysql",
  "logging":false,
  "pool": {
    max: 10, // 最大连接数
    min: 0,  // 最小空闲连接数
    acquire: 30000, // 获取连接的超时时间
    idle: 10000 // 连接空闲超时时间
  }
};
