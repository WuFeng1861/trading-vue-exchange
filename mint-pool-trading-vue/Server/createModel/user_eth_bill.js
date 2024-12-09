export default function(sequelize, DataTypes) {
  return sequelize.define('user_eth_bill', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "用户id"
    },
    amount: {
      type: DataTypes.DECIMAL(40,20),
      allowNull: true,
      comment: "用户获取的数量"
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "用户eth变化的方式 0充值 "
    },
    chain_hash: {
      type: DataTypes.CHAR(66),
      allowNull: true,
      comment: "链上的hash"
    }
  }, {
    sequelize,
    tableName: 'user_eth_bill',
    timestamps: true,
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
