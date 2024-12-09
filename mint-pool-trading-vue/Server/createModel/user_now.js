export default function(sequelize, DataTypes) {
  return sequelize.define('user_now', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "用户id"
    },
    nexttime: {
      type: DataTypes.CHAR(13),
      allowNull: true,
      comment: "这次挖矿的最终结束时间\/下次挖矿的开始时间"
    },
    base_mint_rate: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: "挖矿基础速率"
    },
    lastsettletime: {
      type: DataTypes.CHAR(13),
      allowNull: true,
      comment: "上次挖矿结束时间"
    },
    inviter_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "邀请者的id"
    },
    group_mint_rate: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: "挖矿团队速率"
    }
  }, {
    sequelize,
    tableName: 'user_now',
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
