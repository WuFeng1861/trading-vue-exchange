export default function(sequelize, DataTypes) {
  return sequelize.define('user_recharge_address', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "id"
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "用户id"
    },
    t_address: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "地址",
      unique: "uni_address"
    },
    create_time: {
      type: DataTypes.CHAR(13),
      allowNull: true,
      comment: "创建时间戳"
    }
  }, {
    sequelize,
    tableName: 'user_recharge_address',
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
        name: "uni_address",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "t_address" },
        ]
      },
    ]
  });
};
