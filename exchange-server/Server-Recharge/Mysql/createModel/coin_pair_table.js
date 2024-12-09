export default function(sequelize, DataTypes) {
  return sequelize.define('coin_pair_table', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "主键id"
    },
    coin_pair: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "交易对名称",
      unique: "uni_pair"
    },
    coin_first: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    coin_second: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    start_time: {
      type: DataTypes.CHAR(13),
      allowNull: true,
      comment: "创建时间"
    }
  }, {
    sequelize,
    tableName: 'coin_pair_table',
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
        name: "uni_pair",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "coin_pair" },
        ]
      },
    ]
  });
};
