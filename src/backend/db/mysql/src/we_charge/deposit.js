/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, name='deposit') {
  return sequelize.define('deposit', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    SerialNo: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    OwnerName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ZoneName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ItemName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    CheckInDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Charge: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    CheckInNotes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    CheckOutDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    CheckOutNotes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Status: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    }
  }, {
    tableName: name,
    freezeTableName: true,
    timestamps: false
  });
};
