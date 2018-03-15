/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, name='roomgarbagecharge') {
  return sequelize.define('roomgarbagecharge', {
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
    GradeIndex: {
      type: DataTypes.INTEGER(3),
      allowNull: false
    },
    CalcType: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    },
    UnitPrice: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    UsedNumber: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Charge: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    FromStatus: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    }
  }, {
    tableName: name,
    freezeTableName: true,
    timestamps: false
  });
};
