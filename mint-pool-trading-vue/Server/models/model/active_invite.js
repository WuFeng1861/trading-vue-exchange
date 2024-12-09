export default function(sequelize, DataTypes) {
  return sequelize.define('active_invite', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "用户id"
    },
    invite_step: {
      type: DataTypes.TINYINT,
      allowNull: true,
      comment: "邀请人数阶段 0未领取 1-4领取1-4阶段"
    }
  }, {
    sequelize,
    tableName: 'active_invite',
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
