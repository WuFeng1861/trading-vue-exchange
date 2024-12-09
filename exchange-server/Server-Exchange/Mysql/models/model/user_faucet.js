export default function(sequelize, DataTypes) {
  return sequelize.define('user_faucet', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "主键id"
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "用户id"
    },
    nexttime: {
      type: DataTypes.CHAR(13),
      allowNull: true,
      comment: "下次领取时间"
    }
  }, {
    sequelize,
    tableName: 'user_faucet',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
          { name: "user_id" },
        ]
      },
    ]
  });
};
