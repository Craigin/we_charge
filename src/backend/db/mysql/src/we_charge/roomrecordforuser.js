/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, name='roomrecordforuser') {
  return sequelize.define('roomrecordforuser', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ZoneName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    RoomName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    RecordDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: 'CURRENT_TIMESTAMP(6)'
    },
    HireStatus: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    },
    RoomClass: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    },
    UserClass: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    },
    UserName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    User_ZoneName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ElectricityChargeClass: {
      type: DataTypes.STRING,
      allowNull: true
    },
    WaterChargeClass: {
      type: DataTypes.STRING,
      allowNull: true
    },
    GarbageChargeClass: {
      type: DataTypes.STRING,
      allowNull: true
    },
    PayStatus: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    },
    PayDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    PayNotes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: name,
    freezeTableName: true,
    timestamps: false
  });
};
