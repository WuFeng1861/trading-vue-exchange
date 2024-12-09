export default function(sequelize, DataTypes) {
  return sequelize.define('order_table', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "订单id"
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "用户id"
    },
    order_type: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: "订单类型（暂定0买入 1卖出 2市价买入 3 市价卖出）"
    },
    order_price: {
      type: DataTypes.DECIMAL(40, 20),
      allowNull: false,
      comment: "订单价格"
    },
    order_amount: {
      type: DataTypes.DECIMAL(40, 20),
      allowNull: false,
      comment: "订单交易数量"
    },
    order_remain_amount: {
      type: DataTypes.DECIMAL(40, 20),
      allowNull: false,
      comment: "订单未完成数量"
    },
    order_currency_pair: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "订单交易对"
    },
    order_delete: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "订单是否撤销"
    },
    order_finish: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "订单是否完成"
    },
    order_time: {
      type: DataTypes.CHAR(13),
      allowNull: true,
      comment: "订单创建时间"
    }
  }, {
    sequelize,
    tableName: 'order_table',
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
        name: "user",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "type",
        using: "BTREE",
        fields: [
          { name: "order_type" },
        ]
      },
      {
        name: "coin_pair",
        using: "BTREE",
        fields: [
          { name: "order_currency_pair" },
        ]
      },
      {
        name: "is_delete",
        using: "BTREE",
        fields: [
          { name: "order_delete" },
        ]
      },
      {
        name: "is_finish",
        using: "BTREE",
        fields: [
          { name: "order_finish" },
        ]
      },
    ]
  });
};
