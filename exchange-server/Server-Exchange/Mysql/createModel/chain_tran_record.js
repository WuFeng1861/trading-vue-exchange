export default function(sequelize, DataTypes) {
  return sequelize.define('chain_tran_record', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "主键"
    },
    hash: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "交易hash"
    },
    height: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "链上交易高度"
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
    to_address: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "转入钱包的地址（接受币的地址 | 到账地址）"
    },
    finish: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
      comment: "0 未完成 1完成"
    },
    from_address: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "充币的地址"
    }
  }, {
    sequelize,
    tableName: 'chain_tran_record',
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
        name: "uni_chain_hash",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "hash" },
          { name: "chain_id" },
        ]
      },
    ]
  });
};
