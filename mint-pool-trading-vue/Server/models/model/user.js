export default function(sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "主键id"
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "用户邮箱"
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "用户地址"
    },
    tax: {
      type: DataTypes.DECIMAL(20, 4),
      allowNull: true,
      comment: "用户交税数量"
    },
    balance: {
      type: DataTypes.DECIMAL(20, 4),
      allowNull: true,
      comment: "用户余额"
    },
    invitation_code: {
      type: DataTypes.CHAR(6),
      allowNull: true,
      comment: "邀请码"
    },
    inviter_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "邀请人id"
    },
    user_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "用户名称"
    },
    unlock_balance: {
      type: DataTypes.DECIMAL(20, 4),
      allowNull: true,
      comment: "解锁的余额（可使用的余额）"
    }
  }, {
    sequelize,
    tableName: 'user',
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
