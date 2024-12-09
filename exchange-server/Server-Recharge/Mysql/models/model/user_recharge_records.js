export default function(sequelize, DataTypes) {
  return sequelize.define('user_recharge_records', {
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
      comment: "用户的id"
    },
    t_amount: {
      type: DataTypes.DECIMAL(40,20),
      allowNull: true,
      comment: "交易金额"
    },
    t_address_to: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "到账地址"
    },
    t_hash: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "链上hash"
    },
    t_chain_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "链id"
    },
    t_address_from: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "转账地址"
    },
    t_height: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "交易高度"
    }
  }, {
    sequelize,
    tableName: 'user_recharge_records',
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
      {
        name: "uni_hash_chain",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "t_hash" },
          { name: "t_chain_id" },
        ]
      },
    ]
  });
};
