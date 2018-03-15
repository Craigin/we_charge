/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, name='waterchargerule') {
  return sequelize.define('waterchargerule', {
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
    GradeIndex: {
      type: DataTypes.INTEGER(3),
      allowNull: false
    },
    Start_Quantity: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Over_Quantity: {
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
    }
  }, {
    tableName: name,
    freezeTableName: true,
    timestamps: false
  });
};
