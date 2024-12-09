export default function(sequelize, DataTypes) {
  return sequelize.define('rate_table', {
    output: {
      type: DataTypes.DECIMAL(20,4),
      allowNull: true,
      comment: "总产量"
    },
    mint_rate: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: "基础算力"
    }
  }, {
    sequelize,
    tableName: 'rate_table',
    timestamps: false
  });
};
