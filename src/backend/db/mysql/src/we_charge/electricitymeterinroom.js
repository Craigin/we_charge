/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, name='electricitymeterinroom') {
  return sequelize.define('electricitymeterinroom', {
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
    InitNumber: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    ManufactoryCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ExchangeRate: {
      type: DataTypes.INTEGER(10),
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
