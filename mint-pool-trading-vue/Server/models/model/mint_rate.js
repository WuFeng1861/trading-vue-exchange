export default function(sequelize, DataTypes) {
  return sequelize.define('mint_rate', {
    total: {
      type: DataTypes.DECIMAL(20, 4),
      allowNull: true,
      comment: "总量"
    },
    output: {
      type: DataTypes.DECIMAL(20, 4),
      allowNull: true,
      comment: "总产量"
    },
    cur_mint_rate: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: "当前基础算力"
    }
  }, {
    sequelize,
    tableName: 'mint_rate',
    timestamps: false
  });
};
