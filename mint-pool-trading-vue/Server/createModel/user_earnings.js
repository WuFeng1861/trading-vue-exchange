export default function(sequelize, DataTypes) {
  return sequelize.define('user_earnings', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "用户id"
    },
    createtime: {
      type: DataTypes.CHAR(13),
      allowNull: true,
      comment: "收益获取的时间"
    },
    type: {
      type: DataTypes.TINYINT,
      allowNull: true,
      comment: "收益类型 1.挖矿收益 2. 转账收益 3. 游戏收益 4.邀请收益"
    },
    earnings: {
      type: DataTypes.DECIMAL(20,4),
      allowNull: true,
      comment: "收益数量"
    },
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "主键id"
    },
    tax: {
      type: DataTypes.DECIMAL(20,4),
      allowNull: true,
      comment: "税收"
    }
  }, {
    sequelize,
    tableName: 'user_earnings',
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
