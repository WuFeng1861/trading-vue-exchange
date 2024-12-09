export default function(sequelize, DataTypes) {
  return sequelize.define('mq_email_user', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "主键id"
    },
    user: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "用户名"
    },
    pass: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "授权码"
    },
    app: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "所属应用名字"
    },
    email_company: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "邮箱所属公司 QQ|163|ali"
    },
    limit_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "限制每日发送的邮件数量"
    }
  }, {
    sequelize,
    tableName: 'mq_email_user',
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
