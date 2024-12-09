export default function(sequelize, DataTypes) {
  return sequelize.define('mq_bind_address', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "用户主键"
    },
    code: {
      type: DataTypes.CHAR(10),
      allowNull: true,
      comment: "用户绑定地址的验证码"
    },
    email: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "用户邮箱"
    },
    complete: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
      comment: "0 未完成 1 完成"
    },
    last_time: {
      type: DataTypes.CHAR(13),
      allowNull: true,
      defaultValue: "0",
      comment: "上次发送的时间戳"
    },
    send_count: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
      comment: "发送的次数"
    }
  }, {
    sequelize,
    tableName: 'mq_bind_address',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
