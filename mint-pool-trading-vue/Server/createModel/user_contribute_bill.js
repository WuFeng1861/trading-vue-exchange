export default function(sequelize, DataTypes) {
  return sequelize.define('user_contribute_bill', {
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
      comment: "贡献的人 也就是被邀请者"
    },
    contribute_value: {
      type: DataTypes.DECIMAL(20,4),
      allowNull: true,
      comment: "贡献的数值"
    },
    create_time: {
      type: DataTypes.CHAR(13),
      allowNull: true,
      comment: "贡献的时间"
    },
    type: {
      type: DataTypes.TINYINT,
      allowNull: true,
      comment: "贡献类型1 挖矿"
    },
    inviter_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "邀请者id"
    }
  }, {
    sequelize,
    tableName: 'user_contribute_bill',
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
