/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, name='company') {
  return sequelize.define('company', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    CompanyName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ZoneName: {
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
