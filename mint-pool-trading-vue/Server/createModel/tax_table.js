export default function(sequelize, DataTypes) {
  return sequelize.define('tax_table', {
    mint_output: {
      type: DataTypes.DECIMAL(20,4),
      allowNull: true,
      comment: "挖矿产量"
    },
    tax_ratio: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: "收税百分比"
    }
  }, {
    sequelize,
    tableName: 'tax_table',
    timestamps: false
  });
};
