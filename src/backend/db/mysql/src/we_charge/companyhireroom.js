/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, name='companyhireroom') {
  return sequelize.define('companyhireroom', {
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
      allowNull: false
    },
    RoomName: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: name,
    freezeTableName: true,
    timestamps: false
  });
};
