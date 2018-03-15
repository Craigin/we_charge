/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, name='entity_mustlistfieldname') {
  return sequelize.define('entity_mustlistfieldname', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    EntityClass: {
      type: DataTypes.INTEGER(5),
      allowNull: false
    },
    PropertyName: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: name,
    freezeTableName: true,
    timestamps: false
  });
};
