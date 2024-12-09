export default function(sequelize, DataTypes) {
  return sequelize.define('user_balance', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "主键"
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "用户id"
    },
    currency: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "币种名称"
    },
    balance: {
      type: DataTypes.DECIMAL(40,20),
      allowNull: true,
      comment: "余额"
    }
  }, {
    sequelize,
    tableName: 'user_balance',
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
        name: "uni_user_currency",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_id" },
          { name: "currency" },
        ]
      },
      {
        name: "search_user",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
};
