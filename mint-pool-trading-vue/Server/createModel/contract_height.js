export default function(sequelize, DataTypes) {
  return sequelize.define('contract_height', {
    height: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "上次查询的高度"
    }
  }, {
    sequelize,
    tableName: 'contract_height',
    timestamps: false
  });
};
