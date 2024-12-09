export default function(sequelize, DataTypes) {
  return sequelize.define('user_contribute', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "用户id"
    },
    contribution_value: {
      type: DataTypes.DECIMAL(20,4),
      allowNull: true,
      comment: "用户给邀请者贡献的币量"
    },
    inviter_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "邀请者id"
    },
    is_lock: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1,
      comment: "是否锁定 0不锁定 1锁定"
    }
  }, {
    sequelize,
    tableName: 'user_contribute',
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
