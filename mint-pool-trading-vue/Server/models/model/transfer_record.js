export default function (sequelize, DataTypes) {
  return sequelize.define('transfer_record', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "主键id"
    },
    hash: {
      type: DataTypes.CHAR(64),
      allowNull: true,
      comment: "hash",
      unique: "uni_hash"
    },
    coin_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "币名"
    },
    type: {
      type: DataTypes.TINYINT,
      allowNull: true,
      comment: "交易类型(每种币都有自己的类型)"
    },
    sender: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "发送者（地址）"
    },
    receiver: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "接收者（地址）"
    },
    amount: {
      type: DataTypes.DECIMAL(40, 20),
      allowNull: true,
      comment: "数量"
    },
    create_time: {
      type: DataTypes.CHAR(13),
      allowNull: true,
      comment: "时间戳"
    },
    fee: {
      type: DataTypes.DECIMAL(40, 20),
      allowNull: true,
      comment: "税收或者手续费"
    },
    remark: {
      type: DataTypes.STRING(2000),
      allowNull: true,
      comment: "备注"
    }
  }, {
    sequelize,
    tableName: 'transfer_record',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          {name: "id"},
        ]
      },
      {
        name: "uni_hash",
        unique: true,
        using: "BTREE",
        fields: [
          {name: "hash"},
        ]
      },
      {
        name: "search_coin",
        using: "BTREE",
        fields: [
          {name: "coin_name"},
        ]
      },
      {
        name: "search_sender",
        using: "BTREE",
        fields: [
          {name: "sender"},
        ]
      },
      {
        name: "search_receiver",
        using: "BTREE",
        fields: [
          {name: "receiver"},
        ]
      },
    ]
  });
};
