export default function(sequelize, DataTypes) {
  return sequelize.define('fee_table', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "主键id"
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "用户id",
      unique: "uni_user"
    },
    fee_receive: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "用户手续费"
    }
  }, {
    sequelize,
    tableName: 'fee_table',
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
        name: "uni_user",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
};
