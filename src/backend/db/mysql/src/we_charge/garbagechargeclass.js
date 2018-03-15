/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, name='garbagechargeclass') {
  return sequelize.define('garbagechargeclass', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ClassName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    CalcType: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    },
    RatedWater: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    PriceByUser: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    PriceByUnitWater: {
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
