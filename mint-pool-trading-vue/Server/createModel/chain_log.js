export default function(sequelize, DataTypes) {
  return sequelize.define('chain_log', {
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
    hash: {
      type: DataTypes.CHAR(66),
      allowNull: true,
      comment: "链上交易的hash"
    },
    amount: {
      type: DataTypes.DECIMAL(40,20),
      allowNull: true,
      comment: "交易的eth数量"
    },
    income: {
      type: DataTypes.TINYINT,
      allowNull: true,
      comment: "是否是收入 0支出 1收入"
    },
    address: {
      type: DataTypes.CHAR(42),
      allowNull: true,
      comment: "用户的地址"
    },
    height: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "交易的高度"
    }
  }, {
    sequelize,
    tableName: 'chain_log',
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
