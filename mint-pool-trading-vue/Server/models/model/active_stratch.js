export default function(sequelize, DataTypes) {
  return sequelize.define('active_stratch', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "用户id"
    },
    finish: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
      comment: "今天是不是还能刮 0能 1不能"
    },
    times: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "今天的刮奖次数"
    }
  }, {
    sequelize,
    tableName: 'active_stratch',
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
