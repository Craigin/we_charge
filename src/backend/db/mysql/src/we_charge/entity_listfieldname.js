/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, name='entity_listfieldname') {
  return sequelize.define('entity_listfieldname', {
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
    },
    ColWidth: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    ListIndex: {
      type: DataTypes.INTEGER(5),
      allowNull: true
    }
  }, {
    tableName: name,
    freezeTableName: true,
    timestamps: false
  });
};
