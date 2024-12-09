export default function(sequelize, DataTypes) {
  return sequelize.define('price_update_table', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "主键id"
    },
    price: {
      type: DataTypes.DECIMAL(40, 20),
      allowNull: true,
      comment: "价格"
    },
    currency_pair: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "交易对名称"
    },
    time: {
      type: DataTypes.CHAR(13),
      allowNull: true,
      comment: "价格变化的时间戳"
    }
  }, {
    sequelize,
    tableName: 'price_update_table',
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
