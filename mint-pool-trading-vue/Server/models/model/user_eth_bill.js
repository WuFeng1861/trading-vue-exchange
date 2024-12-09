export default function (sequelize, DataTypes) {
  return sequelize.define('user_eth_bill', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "用户id"
      },
      amount: {
        type: DataTypes.DECIMAL(40, 20),
        allowNull: true,
        comment: "用户获取的数量"
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "用户eth变化的方式 0充值 1转账。。。"
      },
      chain_hash: {
        type: DataTypes.CHAR(66),
        allowNull: true,
        comment: "链上的hash"
      },
      created_at: {
        type: DataTypes.BIGINT,
        allowNull: true,
        comment: "创建时间"
      }
    }, {
      sequelize,
      tableName: 'user_eth_bill',
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            {name: "id"},
          ]
        },
      ]
    }
  );
};
