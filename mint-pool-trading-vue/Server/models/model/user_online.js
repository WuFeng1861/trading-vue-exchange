export default function(sequelize, DataTypes) {
  return sequelize.define('user_online', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "主键"
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "用户的id"
    },
    invitee_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "被邀请者id"
    },
    online: {
      type: DataTypes.TINYINT,
      allowNull: true,
      comment: "上次邀请者挖矿的时候是否在线 0不在 1在线"
    }
  }, {
    sequelize,
    tableName: 'user_online',
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
