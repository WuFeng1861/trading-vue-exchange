export default function(sequelize, DataTypes) {
  return sequelize.define('user_eth', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "用户id"
    },
    amount: {
      type: DataTypes.DECIMAL(40, 20),
      allowNull: true,
      comment: "用户充值的eth数量"
    }
  }, {
    sequelize,
    tableName: 'user_eth',
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
