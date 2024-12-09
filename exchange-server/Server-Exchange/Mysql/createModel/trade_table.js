export default function(sequelize, DataTypes) {
  return sequelize.define('trade_table', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "成交订单id"
    },
    order_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "订单id"
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "用户id"
    },
    trade_time: {
      type: DataTypes.CHAR(13),
      allowNull: false,
      comment: "成交时间"
    },
    trade_price: {
      type: DataTypes.DECIMAL(40,20),
      allowNull: false,
      comment: "成交价格"
    },
    trade_amount: {
      type: DataTypes.DECIMAL(40,20),
      allowNull: false,
      comment: "成交数量"
    },
    trade_fee: {
      type: DataTypes.DECIMAL(40,20),
      allowNull: false,
      comment: "成交手续费"
    },
    order_currency_pair: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "订单交易对"
    },
    trade_type: {
      type: DataTypes.TINYINT,
      allowNull: true,
      comment: "成交类型和订单类型一致（0 购买 1 卖出）"
    }
  }, {
    sequelize,
    tableName: 'trade_table',
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
        name: "orderkey",
        using: "BTREE",
        fields: [
          { name: "order_id" },
        ]
      },
      {
        name: "user",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "currency",
        using: "BTREE",
        fields: [
          { name: "order_currency_pair" },
        ]
      },
    ]
  });
};
