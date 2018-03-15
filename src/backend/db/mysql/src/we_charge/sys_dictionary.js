/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, name='sys_dictionary') {
  return sequelize.define('sys_dictionary', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ItemClass: {
      type: DataTypes.INTEGER(3),
      allowNull: false
    },
    ItemName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    NeedCopyFromPreMonth: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    }
  }, {
    tableName: name,
    freezeTableName: true,
    timestamps: false
  });
};
