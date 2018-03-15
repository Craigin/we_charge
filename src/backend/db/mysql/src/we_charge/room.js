/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, name='room') {
  return sequelize.define('room', {
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
    UserName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    RoomClass: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    },
    HireStatus: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    },
    WaterChargeClass: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ElectricityChargeClass: {
      type: DataTypes.STRING,
      allowNull: true
    },
    GarbageChargeClass: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: name,
    freezeTableName: true,
    timestamps: false
  });
};
