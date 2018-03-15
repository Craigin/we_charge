/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, name='applicationuser') {
  return sequelize.define('applicationuser', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    UserID: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    IsAdmin: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    },
    roles: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    sectors: {
      type: DataTypes.STRING,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER(3),
      allowNull: false,
      defaultValue: '1'
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: 'CURRENT_TIMESTAMP'
    }
  }, {
    tableName: name,
    freezeTableName: true,
    timestamps: false
  });
};
