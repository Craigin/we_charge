/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, name='roomwatercharge') {
  return sequelize.define('roomwatercharge', {
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
    GradeIndex: {
      type: DataTypes.INTEGER(3),
      allowNull: false
    },
    UseNumber: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    SewagePercent: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Water_UnitPrice: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Sewage_UnitPrice: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Water_Charge: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Sewage_Charge: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    tableName: name,
    freezeTableName: true,
    timestamps: false
  });
};
