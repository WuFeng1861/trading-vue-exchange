export default function(sequelize, DataTypes) {
  return sequelize.define('user_withdraw_records', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "主键id"
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "用户id"
    },
    t_hash: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "链上hash"
    },
    amount: {
      type: DataTypes.DECIMAL(40,20),
      allowNull: true,
      comment: "数量"
    },
    coin_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "币种名称"
    },
    chain_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "链id"
    },
    t_finish: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "0 未完成 1完成"
    },
    to_address: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "收款地址"
    }
  }, {
    sequelize,
    tableName: 'user_withdraw_records',
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
