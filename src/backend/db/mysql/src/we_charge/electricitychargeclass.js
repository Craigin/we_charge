/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, name='electricitychargeclass') {
  return sequelize.define('electricitychargeclass', {
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
