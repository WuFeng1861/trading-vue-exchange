export default function(sequelize, DataTypes) {
  return sequelize.define('address_all', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "主键"
    },
    t_address: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "地址"
    },
    t_privatekey: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "私钥"
    },
    t_init_balance: {
      type: DataTypes.DECIMAL(40, 20),
      allowNull: true,
      comment: "获取的时候的这个地址余额"
    }
  }, {
    sequelize,
    tableName: 'address_all',
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
