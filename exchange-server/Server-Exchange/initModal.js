'use strict';
// sequelize.model.js
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
const modelName = process.argv[2];
const database = {
    // [required] * 数据库地址
    host: 'localhost',
    // [required] * 数据库名称
    database: 'exchange_merc',
    // 数据库用户名
    user: 'root',
    // 数据库密码
    pass: '666666',
    // 数据库端口号
    port: 3306,
    // Sequelize的构造函数“options”标记对象的JSON文件路径
    config: '',
    // 输出文件路径
    output: './Mysql/createModel',
    // 数据库类型：postgres, mysql, sqlite
    dialect: 'mysql',
    // 包含在model的配置参数中define的模型定义的JSON文件路径
    additional: '',
    // 表名,多个表名逗号分隔， 所有表的话不用填
    tables: modelName || '',
    // 要跳过的表名，多个表名逗号分隔
    'skip-tables': '',
    // 使用驼峰命名模型和字段
    camel: false,
    // 是否写入文件
    'no-write': false,
    // 从中检索表的数据库架构
    schema: false,
    // 将模型输出为typescript文件
    typescript: false,
};

let connectShell = 'sequelize-auto';
for (const i in database) {
    const value = database[i];
    if (value) {
        if (value === true) {
            connectShell += ` --${i}`;
        } else {
            connectShell += ` --${i} ${value}`;
        }
    }
}
// SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA = 'mint';
console.log(connectShell);
exec(connectShell, (err, stdout, stderr) => {
    console.log(`stderr: ${stderr}`);
    console.log(`stdout: ${stdout}`);
    setTimeout(formatToES6, 100);
    if (err) {
        console.log(`exec error: ${err}`);
    }
});



// 读取文件夹中的所有文件

const formatToES6 = () => {
    const folderPath = database.output; // 替换为要读取的文件夹路径

    const searchStr = `const Sequelize = require('sequelize');
module.exports =`; // 替换为要查找的内容

    const replaceStr = 'export default'; // 替换为要替换的内容
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('无法读取文件夹：', err);
            return;
        }
        // 遍历文件夹中的每个文件
        files.forEach((file) => {
            const filePath = path.join(folderPath, file);
            // 读取文件内容
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error(`无法读取文件 ${filePath}：`, err);
                    return;
                }
                // 替换指定内容
                console.log(filePath, data.indexOf(searchStr));
                if (data.indexOf(searchStr) === -1) {
                    return;
                }
                const replacedContent = data.replace(searchStr, replaceStr);
                // 将替换后的内容写入文件
                fs.writeFile(filePath, replacedContent, 'utf8', (err) => {
                    if (err) {
                        console.error(`无法写入文件 ${filePath}：`, err);
                    } else {
                        console.log(`文件 ${filePath} 替换成功`);
                    }
                });
            });
        });
    });
};
