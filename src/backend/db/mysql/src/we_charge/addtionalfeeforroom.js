/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, name='addtionalfeeforroom') {
  return sequelize.define('addtionalfeeforroom', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ZoneName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    RoomName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    RecordDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: 'CURRENT_TIMESTAMP(6)'
    },
    ItemClass: {
      type: DataTypes.INTEGER(3),
      allowNull: false
    },
    ItemName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Charge: {
      type: DataTypes.FLOAT,
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
