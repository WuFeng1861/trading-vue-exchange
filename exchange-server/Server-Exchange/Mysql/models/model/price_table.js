export default function(sequelize, DataTypes) {
  return sequelize.define('price_table', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "主键id"
    },
    currency_pair: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "交易对名称",
      unique: "uni_pair"
    },
    currency_price: {
      type: DataTypes.DECIMAL(40, 20),
      allowNull: true,
      comment: "价格"
    },
    init_price: {
      type: DataTypes.DECIMAL(40, 20),
      allowNull: true,
      comment: "初始价格"
    },
    min_price: {
      type: DataTypes.DECIMAL(40, 20),
      allowNull: true,
      comment: "最低价格"
    },
    max_price: {
      type: DataTypes.DECIMAL(40, 20),
      allowNull: true,
      comment: "最高价格"
    }
  }, {
    sequelize,
    tableName: 'price_table',
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
        name: "uni_pair",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "currency_pair" },
        ]
      },
    ]
  });
};
