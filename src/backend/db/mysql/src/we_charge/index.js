import * as utils from '../utils'

export default function (databaseName, sequelize, DataTypes, opts) {
  return utils.exportTables(databaseName, {
    addtionalfeeforcompany: {},
    addtionalfeeforroom: {},
    applicationuser: {},
    company: {},
    companyhireroom: {},
    deposit: {},
    electricitychargeclass: {},
    electricitychargerule: {},
    electricitymeterinroom: {},
    electricitymeterrecord: {},
    entity_allfieldname: {},
    entity_listfieldname: {},
    entity_mustlistfieldname: {},
    garbagechargeclass: {},
    payinform: {},
    room: {},
    roomelectricitycharge: {},
    roomgarbagecharge: {},
    roomrecordforuser: {},
    roomwatercharge: {},
    sys_dictionary: {},
    tbl_supervisor: {},
    waterchargeclass: {},
    waterchargerule: {},
    watermeterinroom: {},
    watermeterrecord: {},
    zone: {}
  }, __dirname, sequelize, DataTypes, opts)
}
