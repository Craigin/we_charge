/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, name='watermeterrecord') {
  return sequelize.define('watermeterrecord', {
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
    MeterCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    RecordDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: 'CURRENT_TIMESTAMP'
    },
    ExchangeRate: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    PreviousNumber: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    LastNumber: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    UsedNumber: {
      type: DataTypes.FLOAT,
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
