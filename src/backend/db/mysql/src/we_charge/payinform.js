/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, name='payinform') {
  return sequelize.define('payinform', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    PayDate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    BankName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    AccountName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    AccountNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sector: {
      type: DataTypes.STRING,
      allowNull: false
    },
    payload: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    zone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: name,
    freezeTableName: true,
    timestamps: false
  });
};
