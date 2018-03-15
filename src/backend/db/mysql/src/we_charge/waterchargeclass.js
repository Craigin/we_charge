/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, name='waterchargeclass') {
  return sequelize.define('waterchargeclass', {
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
    SewagePercent: {
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
